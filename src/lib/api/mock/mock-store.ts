import { z } from "zod";
import type {
  UnitDto,
  UnitDetailDto,
} from "../contracts/unit";
import type {
  LessonDto,
  LessonSummaryDto,
  ResourceDto,
  LessonFilter,
} from "../contracts/lesson";
import type { QuestionDto, QuizResultDto } from "../contracts/question";
import type { PageResult } from "../contracts/common";

import {
  unitSchema,
  lessonContentSchema,
  lessonSummarySchema,
  resourceSchema,
} from "../schemas/course";
import {
  questionSchema,
  quizResultSchema,
} from "../schemas/question";

import unitsFixture from "./fixtures/units.json";
import lessonsFixture from "./fixtures/lessons.json";
import resourcesFixture from "./fixtures/resources.json";
import questionsFixture from "./fixtures/questions.json";

/** Raw fixture row for a lesson: the DTO fields plus relation ids. */
const rawLessonSchema = lessonSummarySchema
  .omit({ unitTitle: true, questionCount: true, resourceCount: true })
  .extend({
    resourceIds: z.array(z.string().min(1)),
    questionIds: z.array(z.string().min(1)),
    content: lessonContentSchema,
  });

export type RawLesson = z.infer<typeof rawLessonSchema>;

export interface MockDatabase {
  units: UnitDto[];
  lessons: RawLesson[];
  resources: ResourceDto[];
  questions: QuestionDto[];
  /** Mutable state: graded quiz attempts (persisted to sessionStorage in the browser). */
  attempts: Record<string, QuizResultDto>;
}

const SESSION_KEY = "edu2bac-mock-v1";

declare global {
  var __EDU2BAC_MOCK_DB__: MockDatabase | undefined;
}

function parseFixture<T>(schema: z.ZodType<T>, data: unknown, name: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `[mock-store] Invalid fixture "${name}": ${result.error.message}`
    );
  }
  return result.data;
}

function loadPersistedAttempts(): Record<string, QuizResultDto> {
  if (typeof sessionStorage === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const attempts: Record<string, QuizResultDto> = {};
    for (const [key, value] of Object.entries(parsed)) {
      const result = quizResultSchema.safeParse(value);
      if (result.success) attempts[key] = result.data;
    }
    return attempts;
  } catch {
    return {};
  }
}

function persistAttempts(attempts: Record<string, QuizResultDto>): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(attempts));
  } catch {
    // Quota / privacy mode — mock persistence is best-effort only.
  }
}

export function seedMockDatabase(): MockDatabase {
  const units = parseFixture(z.array(unitSchema), unitsFixture, "units.json");
  const lessons = parseFixture(z.array(rawLessonSchema), lessonsFixture, "lessons.json");
  const resources = parseFixture(z.array(resourceSchema), resourcesFixture, "resources.json");
  const questions = parseFixture(z.array(questionSchema), questionsFixture, "questions.json");

  return {
    units,
    lessons,
    resources,
    questions,
    attempts: loadPersistedAttempts(),
  };
}

export function getMockDatabase(): MockDatabase {
  if (!globalThis.__EDU2BAC_MOCK_DB__) {
    globalThis.__EDU2BAC_MOCK_DB__ = seedMockDatabase();
  }
  return globalThis.__EDU2BAC_MOCK_DB__;
}

/** Re-seeds the database from fixtures. Used by tests (and dev). */
export function resetMockDatabase(): MockDatabase {
  globalThis.__EDU2BAC_MOCK_DB__ = seedMockDatabase();
  return globalThis.__EDU2BAC_MOCK_DB__;
}

export function saveAttempt(attempt: QuizResultDto): void {
  const db = getMockDatabase();
  db.attempts[attempt.attemptId] = attempt;
  persistAttempts(db.attempts);
}

// ---------------------------------------------------------------------------
// Read helpers (shared by the mock transport so counts stay consistent).
// ---------------------------------------------------------------------------

export function getUnit(db: MockDatabase, idOrSlug: string): UnitDto | undefined {
  return db.units.find(
    (u) => u.id === idOrSlug || u.slug === idOrSlug
  );
}

export function getLesson(db: MockDatabase, slug: string): RawLesson | undefined {
  return db.lessons.find((l) => l.slug === slug);
}

export function publishedLessons(db: MockDatabase): RawLesson[] {
  return db.lessons.filter((l) => l.status === "published");
}

export function toLessonSummary(db: MockDatabase, lesson: RawLesson): LessonSummaryDto {
  const unit = getUnit(db, lesson.unitId);
  return {
    id: lesson.id,
    slug: lesson.slug,
    number: lesson.number,
    title: lesson.title,
    description: lesson.description,
    unitId: lesson.unitId,
    unitTitle: unit?.title ?? "",
    difficulty: lesson.difficulty,
    duration: lesson.duration,
    status: lesson.status,
    tags: lesson.tags,
    questionCount: lesson.questionIds.length,
    resourceCount: lesson.resourceIds.length,
    updatedAt: lesson.updatedAt,
  };
}

export function toLessonDto(db: MockDatabase, lesson: RawLesson): LessonDto {
  const unit = getUnit(db, lesson.unitId);
  return {
    ...toLessonSummary(db, lesson),
    unitSlug: unit?.slug ?? lesson.unitId,
    content: lesson.content,
  };
}

export function toUnitDto(db: MockDatabase, unit: UnitDto): UnitDto {
  const lessons = db.lessons.filter(
    (l) => l.unitId === unit.id && l.status === "published"
  );
  const questionCount = lessons.reduce(
    (sum, lesson) => sum + lesson.questionIds.length,
    0
  );
  return {
    ...unit,
    lessonCount: lessons.length,
    questionCount,
  };
}

export function toUnitDetailDto(db: MockDatabase, unit: UnitDto): UnitDetailDto {
  const lessons = db.lessons
    .filter((l) => l.unitId === unit.id && l.status === "published")
    .sort((a, b) => a.number - b.number)
    .map((lesson) => toLessonSummary(db, lesson));
  return {
    ...toUnitDto(db, unit),
    lessons,
  };
}

function normalizeSearch(value: string): string {
  return value.trim().toLowerCase();
}

export function filterLessons(
  db: MockDatabase,
  filter: LessonFilter
): RawLesson[] {
  let lessons = db.lessons.filter((l) => l.status === (filter.status ?? "published"));

  if (filter.unitId) {
    lessons = lessons.filter((l) => l.unitId === filter.unitId);
  }
  if (filter.difficulty) {
    lessons = lessons.filter((l) => l.difficulty === filter.difficulty);
  }
  if (filter.search) {
    const needle = normalizeSearch(filter.search);
    lessons = lessons.filter((l) => {
      const haystack = [l.title, l.description, ...l.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }

  const difficultyOrder: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
  };

  switch (filter.sort ?? "default") {
    case "newest":
      lessons = [...lessons].sort((a, b) =>
        b.updatedAt.localeCompare(a.updatedAt)
      );
      break;
    case "duration":
      lessons = [...lessons].sort((a, b) => a.duration - b.duration);
      break;
    case "difficulty":
      lessons = [...lessons].sort(
        (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
      );
      break;
    default:
      lessons = [...lessons].sort((a, b) => a.number - b.number);
  }

  return lessons;
}

export function paginateLessons(
  db: MockDatabase,
  filter: LessonFilter
): PageResult<LessonSummaryDto> {
  const filtered = filterLessons(db, filter);
  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const items = filtered
    .slice(start, start + pageSize)
    .map((lesson) => toLessonSummary(db, lesson));

  return {
    items,
    meta: { page, pageSize, total, totalPages },
  };
}
