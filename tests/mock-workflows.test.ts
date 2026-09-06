import { describe, it, expect, beforeEach } from "vitest";

import { createApiClient } from "@/lib/api/client/api-client";
import { createMockTransport } from "@/lib/api/mock/mock-transport";
import { resetMockDatabase } from "@/lib/api/mock/mock-store";
import { homeApi } from "@/lib/api/modules/home/endpoint";
import { unitsApi } from "@/lib/api/modules/units/endpoint";
import { lessonsApi } from "@/lib/api/modules/lessons/endpoint";
import { quizApi } from "@/lib/api/modules/quiz/endpoint";
import { gradeQuiz } from "@/lib/quiz/grade-quiz";
import { createLocalProgressRepository } from "@/lib/progress/local-progress-repository";
import { PROGRESS_STORAGE_KEY } from "@/lib/progress/local-progress-repository";
import type { ApiScope } from "@/lib/api/contracts/common";
import type {
  GradeQuizInput,
  QuestionDto,
  QuizResultDto,
} from "@/lib/api/contracts/question";

function client(scope: ApiScope = "student") {
  return createApiClient(createMockTransport(), scope);
}

const api = {
  home: homeApi(client()),
  units: unitsApi(client()),
  lessons: lessonsApi(client()),
  quiz: quizApi(client()),
};

function makeResult(percent: number): QuizResultDto {
  return {
    attemptId: `attempt-${percent}`,
    lessonId: "lesson-01",
    score: percent,
    total: 100,
    percent,
    correctCount: percent,
    incorrectCount: 100 - percent,
    answers: [],
    completedAt: new Date().toISOString(),
  };
}

function createLocalStorageMock() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => void store.set(key, String(value)),
    removeItem: (key: string) => void store.delete(key),
    clear: () => store.clear(),
  };
}

describe("mock workflows", () => {
  beforeEach(() => {
    resetMockDatabase();
    (globalThis as { window?: unknown }).window = {
      localStorage: createLocalStorageMock(),
    };
  });

  // 1. Home content ------------------------------------------------------
  it("loads home content with an Arabic hero and at least 4 benefits", async () => {
    const content = await api.home.content();
    expect(content.heroTitle).toMatch(/[\u0600-\u06FF]/);
    expect(content.benefits.length).toBeGreaterThanOrEqual(4);
    expect(content.features.length).toBeGreaterThanOrEqual(4);
  });

  // 2. Units -------------------------------------------------------------
  it("returns the four first-semester units in curriculum order", async () => {
    const units = await api.units.list();
    expect(units).toHaveLength(4);
    expect(units.map((unit) => unit.order)).toEqual([1, 2, 3, 4]);
    expect(units.map((unit) => unit.slug)).toEqual([
      "it-and-society",
      "cybersecurity",
      "web-applications",
      "web-design-and-media",
    ]);
    expect(units[0].title).toBe("تكنولوجيا المعلومات والمجتمع");
    expect(units[0].lessonCount).toBe(2);
    expect(units[0].questionCount).toBe(18);
    expect(units.slice(1).every((unit) => unit.lessonCount === 0)).toBe(true);
  });

  // 3. Lessons list ------------------------------------------------------
  it("returns the 2 published lessons", async () => {
    const result = await api.lessons.list({ pageSize: 100 });
    expect(result.meta.total).toBe(2);
    expect(result.items.map((lesson) => lesson.id)).toEqual(["lesson-01", "lesson-02"]);
    expect(result.items.every((lesson) => lesson.status === "published")).toBe(true);
  });

  it("searches lessons by query", async () => {
    const result = await api.lessons.list({ search: "الحوسبة السحابية" });
    expect(result.items.map((lesson) => lesson.id).sort()).toEqual([
      "lesson-01",
    ]);
  });

  it("filters lessons by unit and difficulty", async () => {
    const byUnit = await api.lessons.list({ unitId: "unit-it-society", pageSize: 100 });
    expect(byUnit.items.map((lesson) => lesson.id).sort()).toEqual([
      "lesson-01",
      "lesson-02",
    ]);

    const beginner = await api.lessons.list({ difficulty: "beginner", pageSize: 100 });
    expect(beginner.items).toHaveLength(2);

    const drafts = await api.lessons.list({ status: "draft", pageSize: 100 });
    expect(drafts.items).toHaveLength(12);
    expect(drafts.items.map((lesson) => lesson.number)).toEqual([
      3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
    expect(drafts.items.every((lesson) => lesson.questionCount === 0)).toBe(true);
    expect(drafts.items.every((lesson) => lesson.resourceCount === 0)).toBe(true);
  });

  it("paginates with correct meta", async () => {
    const page1 = await api.lessons.list({ page: 1, pageSize: 4 });
    expect(page1.items).toHaveLength(2);
    expect(page1.meta.total).toBe(2);
    expect(page1.meta.totalPages).toBe(1);
  });

  // 4. Lesson detail -----------------------------------------------------
  it("gets lesson detail by slug with computed counts", async () => {
    const lesson = await api.lessons.get("it-evolution-and-social-change");
    expect(lesson.title).toBe("تطور تكنولوجيا المعلومات والتحول الاجتماعي");
    expect(lesson.unitSlug).toBe("it-and-society");
    expect(lesson.questionCount).toBe(8);
    expect(lesson.resourceCount).toBe(3); // شرح + سلايد + إجابات
    expect(lesson.content.objectives.length).toBeGreaterThan(0);
  });

  it("gets the published second lesson with its content, resources, and quiz", async () => {
    const lesson = await api.lessons.get("how-artificial-intelligence-works");
    expect(lesson.title).toBe("كيف يعمل الذكاء الاصطناعي");
    expect(lesson.unitSlug).toBe("it-and-society");
    expect(lesson.questionCount).toBe(10);
    expect(lesson.resourceCount).toBe(3);
    expect(lesson.content.objectives).toHaveLength(3);
    expect(lesson.content.concepts).toHaveLength(6);
  });

  it("throws a 404 NOT_FOUND ApiError for an unknown lesson", async () => {
    await expect(api.lessons.get("does-not-exist")).rejects.toMatchObject({
      status: 404,
      code: "NOT_FOUND",
    });
  });

  // 5. Resources ---------------------------------------------------------
  it("lesson resources use the real /resources path convention", async () => {
    const resources = await api.lessons.resources("it-evolution-and-social-change");
    expect(resources).toHaveLength(3);
    for (const resource of resources) {
      expect(resource.source).toBe("upload");
      expect(resource.filePath?.startsWith("/resources/2bac/engineering-cs/")).toBe(true);
      expect(typeof resource.downloadable).toBe("boolean");
      expect(typeof resource.viewable).toBe("boolean");
    }
    const types = resources.map((resource) => resource.type).sort();
    expect(types).toEqual(["pdf", "pdf", "slides"]);
  });

  it("lists the second lesson PDFs from its lesson-specific resource folder", async () => {
    const resources = await api.lessons.resources("how-artificial-intelligence-works");
    expect(resources).toHaveLength(3);
    expect(resources.map((resource) => resource.filePath)).toEqual([
      "/resources/2bac/engineering-cs/how-artificial-intelligence-works/explanation/detailed-explanation.pdf",
      "/resources/2bac/engineering-cs/how-artificial-intelligence-works/slides/slides.pdf",
      "/resources/2bac/engineering-cs/how-artificial-intelligence-works/answers.pdf",
    ]);
    expect(resources.every((resource) => resource.mimeType === "application/pdf")).toBe(true);
  });

  // 6. Quiz --------------------------------------------------------------
  it("strips correctAnswers from the quiz endpoint", async () => {
    const quiz = await api.lessons.quiz("it-evolution-and-social-change");
    expect(quiz).toHaveLength(8);
    for (const question of quiz) {
      expect(question).not.toHaveProperty("correctAnswers");
    }
  });

  it("serves the second lesson's 10 questions without answer keys", async () => {
    const quiz = await api.lessons.quiz("how-artificial-intelligence-works");
    expect(quiz).toHaveLength(10);
    expect(quiz.every((question) => question.type === "single-choice")).toBe(true);
    expect(quiz.every((question) => !("correctAnswers" in question))).toBe(true);
  });

  it("grades all three question types correctly with the pure engine", () => {
    const questions: QuestionDto[] = [
      {
        id: "q1",
        lessonId: "l1",
        type: "single-choice",
        question: "single?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
        ],
        correctAnswers: ["a"],
        points: 1,
      },
      {
        id: "q2",
        lessonId: "l1",
        type: "multiple-choice",
        question: "multi?",
        options: [
          { id: "a", text: "A" },
          { id: "b", text: "B" },
          { id: "c", text: "C" },
        ],
        correctAnswers: ["a", "c"],
        points: 2,
      },
      {
        id: "q3",
        lessonId: "l1",
        type: "true-false",
        question: "tf?",
        options: [
          { id: "true", text: "صحيح" },
          { id: "false", text: "خطأ" },
        ],
        correctAnswers: ["true"],
        points: 1,
      },
    ];

    const result = gradeQuiz(questions, {
      q1: ["a"],
      q2: ["c", "a"], // order-insensitive
      q3: ["true"],
    });

    expect(result.score).toBe(4);
    expect(result.total).toBe(4);
    expect(result.percent).toBe(100);
    expect(result.correctCount).toBe(3);
    expect(result.incorrectCount).toBe(0);
  });

  it("marks a partial multiple-choice selection as wrong", () => {
    const question: QuestionDto = {
      id: "q1",
      lessonId: "l1",
      type: "multiple-choice",
      question: "multi?",
      options: [
        { id: "a", text: "A" },
        { id: "b", text: "B" },
        { id: "c", text: "C" },
      ],
      correctAnswers: ["a", "b", "c"],
      points: 1,
    };
    const result = gradeQuiz([question], { q1: ["a", "b"] });
    expect(result.answers[0].isCorrect).toBe(false);
  });

  it("grades a full quiz through the POST grade endpoint", async () => {
    const questions = await api.lessons.questions("it-evolution-and-social-change");
    const answers: Record<string, string[]> = {};
    for (const question of questions) {
      answers[question.id] = [...question.correctAnswers];
    }
    const input: GradeQuizInput = {
      lessonId: "lesson-01",
      answers,
      startedAt: new Date().toISOString(),
    };
    const result = await api.quiz.grade("it-evolution-and-social-change", input);
    expect(result.percent).toBe(100);
    expect(result.score).toBe(8);
    expect(result.total).toBe(8);
    expect(result.correctCount).toBe(8);
  });

  it("grades the complete second-lesson quiz using its uploaded answer key", async () => {
    const questions = await api.lessons.questions("how-artificial-intelligence-works");
    const answers: Record<string, string[]> = {};
    for (const question of questions) {
      answers[question.id] = [...question.correctAnswers];
    }

    const result = await api.quiz.grade("how-artificial-intelligence-works", {
      lessonId: "lesson-02",
      answers,
      startedAt: new Date().toISOString(),
    });

    expect(result.percent).toBe(100);
    expect(result.score).toBe(10);
    expect(result.total).toBe(10);
    expect(result.correctCount).toBe(10);
  });

  // 7. Validation --------------------------------------------------------
  it("rejects malformed grade input with INVALID_API_REQUEST (422)", async () => {
    const badInput = {
      lessonId: 123,
      answers: "not-an-object",
      startedAt: 42,
    } as unknown as GradeQuizInput;
    await expect(
      api.quiz.grade("it-evolution-and-social-change", badInput)
    ).rejects.toMatchObject({ status: 422, code: "INVALID_API_REQUEST" });
  });

  it("throws INVALID_API_RESPONSE when a response violates its contract", async () => {
    const badTransport = {
      async request() {
        return { items: "not-an-array", meta: {} };
      },
    };
    const badClient = createApiClient(badTransport as never, "student");
    await expect(lessonsApi(badClient).list()).rejects.toMatchObject({
      status: 502,
      code: "INVALID_API_RESPONSE",
    });
  });

  // 8. Progress repository ----------------------------------------------
  it("markLessonCompleted is idempotent", async () => {
    const repo = createLocalProgressRepository();
    await repo.markLessonCompleted("lesson-01");
    const progress = await repo.markLessonCompleted("lesson-01");
    expect(progress.completedLessons).toEqual(["lesson-01"]);
  });

  it("saveQuizResult keeps the best score and increments attempts", async () => {
    const repo = createLocalProgressRepository();
    await repo.saveQuizResult("lesson-01", makeResult(60));
    const progress = await repo.saveQuizResult("lesson-01", makeResult(90));

    expect(progress.quizScores["lesson-01"].bestScore).toBe(90);
    expect(progress.quizScores["lesson-01"].attempts).toBe(2);
    expect(progress.quizScores["lesson-01"].lastScore).toBe(90);
    expect(progress.completedLessons).toContain("lesson-01");
  });

  it("recovers safely from corrupted localStorage", async () => {
    const storage = (globalThis as { window: { localStorage: { setItem: (k: string, v: string) => void } } })
      .window.localStorage;
    storage.setItem(PROGRESS_STORAGE_KEY, "{corrupted-json");
    const repo = createLocalProgressRepository();
    const progress = await repo.get();
    expect(progress.version).toBe(1);
    expect(progress.completedLessons).toEqual([]);
  });

  // 9. Lesson navigation -------------------------------------------------
  it("navigates between the two published lessons", async () => {
    const first = await api.lessons.navigation("it-evolution-and-social-change");
    expect(first.previous).toBeUndefined();
    expect(first.next?.slug).toBe("how-artificial-intelligence-works");

    const second = await api.lessons.navigation("how-artificial-intelligence-works");
    expect(second.previous?.slug).toBe("it-evolution-and-social-change");
    expect(second.next).toBeUndefined();
  });
});
