import type { ApiTransport, RequestOptions } from "../transport/types";
import { ApiError } from "../transport/errors";
import { gradeQuiz } from "@/lib/quiz/grade-quiz";
import type { GradeQuizInput } from "../contracts/question";
import type {
  Difficulty,
  LessonSort,
  LessonStatus,
} from "../contracts/lesson";

import {
  getMockDatabase,
  getUnit,
  getLesson,
  toUnitDto,
  toUnitDetailDto,
  toLessonDto,
  toLessonSummary,
  paginateLessons,
  saveAttempt,
  publishedLessons,
  type MockDatabase,
} from "./mock-store";

import homeFixture from "./fixtures/home.json";

const MOCK_LATENCY_MS = 120;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function notFound(detail: string): ApiError {
  return new ApiError({
    status: 404,
    code: "NOT_FOUND",
    title: "غير موجود",
    detail,
  });
}

type Handler = (
  db: MockDatabase,
  params: Record<string, string>,
  req: RequestOptions
) => unknown;

function match(path: string, pattern: string): Record<string, string> | null {
  const pathParts = path.split("/").filter(Boolean);
  const patternParts = pattern.split("/").filter(Boolean);

  if (pathParts.length !== patternParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i += 1) {
    const p = patternParts[i];
    const value = pathParts[i];
    if (p.startsWith(":")) {
      params[p.slice(1)] = decodeURIComponent(value);
    } else if (p !== value) {
      return null;
    }
  }
  return params;
}

function findHandler(
  method: string,
  path: string
): { handler: Handler; params: Record<string, string> } | null {
  const routes: { method: string; pattern: string; handler: Handler }[] = [
    { method: "GET", pattern: "/v1/home/content", handler: handleHomeContent },
    { method: "GET", pattern: "/v1/units", handler: handleUnits },
    { method: "GET", pattern: "/v1/units/:idOrSlug", handler: handleUnitDetail },
    { method: "GET", pattern: "/v1/lessons", handler: handleLessons },
    {
      method: "GET",
      pattern: "/v1/lessons/next/:slug",
      handler: handleLessonNavigation,
    },
    {
      method: "GET",
      pattern: "/v1/lessons/:slug/resources",
      handler: handleLessonResources,
    },
    {
      method: "GET",
      pattern: "/v1/lessons/:slug/questions",
      handler: handleLessonQuestions,
    },
    { method: "GET", pattern: "/v1/lessons/:slug/quiz", handler: handleLessonQuiz },
    {
      method: "POST",
      pattern: "/v1/lessons/:slug/quiz/grade",
      handler: handleGradeQuiz,
    },
    { method: "GET", pattern: "/v1/lessons/:slug", handler: handleLessonDetail },
    {
      method: "GET",
      pattern: "/v1/quiz/attempts/:attemptId",
      handler: handleQuizAttempt,
    },
  ];

  for (const route of routes) {
    if (route.method !== method) continue;
    const params = match(path, route.pattern);
    if (params) return { handler: route.handler, params };
  }

  return null;
}

function handleHomeContent(): unknown {
  return homeFixture;
}

function handleUnits(db: MockDatabase): unknown {
  return db.units
    .map((unit) => toUnitDto(db, unit))
    .sort((a, b) => a.order - b.order);
}

function handleUnitDetail(db: MockDatabase, params: Record<string, string>): unknown {
  const unit = getUnit(db, params.idOrSlug);
  if (!unit) throw notFound(`لا توجد وحدة بالمعرف «${params.idOrSlug}»`);
  return toUnitDetailDto(db, unit);
}

function handleLessons(db: MockDatabase, _params: Record<string, string>, req: RequestOptions): unknown {
  const query = (req.query ?? {}) as Record<string, string | number | boolean | undefined>;

  return paginateLessons(db, {
    search: typeof query.search === "string" ? query.search : undefined,
    unitId: typeof query.unitId === "string" ? query.unitId : undefined,
    difficulty:
      typeof query.difficulty === "string"
        ? (query.difficulty as Difficulty)
        : undefined,
    status:
      typeof query.status === "string"
        ? (query.status as LessonStatus)
        : undefined,
    sort:
      typeof query.sort === "string" ? (query.sort as LessonSort) : undefined,
    page: typeof query.page === "number" ? query.page : Number(query.page) || undefined,
    pageSize:
      typeof query.pageSize === "number"
        ? query.pageSize
        : Number(query.pageSize) || undefined,
  });
}

function handleLessonDetail(db: MockDatabase, params: Record<string, string>): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);
  return toLessonDto(db, lesson);
}

function handleLessonResources(db: MockDatabase, params: Record<string, string>): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);
  return db.resources.filter((r) => lesson.resourceIds.includes(r.id));
}

function handleLessonQuestions(db: MockDatabase, params: Record<string, string>): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);
  return db.questions.filter((q) => lesson.questionIds.includes(q.id));
}

function handleLessonQuiz(db: MockDatabase, params: Record<string, string>): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);
  return db.questions
    .filter((q) => lesson.questionIds.includes(q.id))
    .map((question) => ({
      id: question.id,
      lessonId: question.lessonId,
      type: question.type,
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      points: question.points,
    }));
}

function handleLessonNavigation(db: MockDatabase, params: Record<string, string>): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);

  const lessons = publishedLessons(db).sort((a, b) => a.number - b.number);
  const index = lessons.findIndex((l) => l.id === lesson.id);

  const previous =
    index > 0 ? toLessonSummary(db, lessons[index - 1]) : undefined;
  const next =
    index >= 0 && index < lessons.length - 1
      ? toLessonSummary(db, lessons[index + 1])
      : undefined;

  return { previous, next };
}

function handleGradeQuiz(db: MockDatabase, params: Record<string, string>, req: RequestOptions): unknown {
  const lesson = getLesson(db, params.slug);
  if (!lesson) throw notFound(`لا يوجد درس بالمعرف «${params.slug}»`);

  const input = req.body as GradeQuizInput;
  const questions = db.questions.filter((q) => lesson.questionIds.includes(q.id));

  const result = gradeQuiz(questions, input.answers);
  result.lessonId = lesson.id;
  saveAttempt(result);
  return result;
}

function handleQuizAttempt(db: MockDatabase, params: Record<string, string>): unknown {
  const attempt = db.attempts[params.attemptId];
  if (!attempt) {
    throw notFound(`لا توجد محاولة اختبار بالمعرف «${params.attemptId}»`);
  }
  return attempt;
}

export function createMockTransport(): ApiTransport {
  return {
    async request<TResponse, TBody = unknown>(
      request: RequestOptions<TBody, TResponse>
    ): Promise<TResponse> {
      await delay(MOCK_LATENCY_MS);
      const db = getMockDatabase();
      const matched = findHandler(request.method, request.path);

      if (!matched) {
        throw new ApiError({
          status: 404,
          code: "NOT_FOUND",
          title: "غير موجود",
          detail: `لا يوجد مسار ${request.method} ${request.path}`,
        });
      }

      return matched.handler(db, matched.params, request) as TResponse;
    },
  };
}
