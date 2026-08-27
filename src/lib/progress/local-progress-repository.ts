import type { ProgressDto, LessonScoreDto } from "@/lib/api/contracts/progress";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { progressSchema } from "@/lib/api/schemas/progress";
import { safeReadStorage, safeWriteStorage } from "./storage";
import type { ProgressRepository } from "./progress-repository";

export const PROGRESS_STORAGE_KEY = "edu2bac-progress-v1";

export function defaultProgress(): ProgressDto {
  return {
    version: 1,
    completedLessons: [],
    quizScores: {},
    updatedAt: new Date().toISOString(),
  };
}

function load(): ProgressDto {
  return safeReadStorage(PROGRESS_STORAGE_KEY, progressSchema, defaultProgress());
}

function save(progress: ProgressDto): ProgressDto {
  progress.updatedAt = new Date().toISOString();
  safeWriteStorage(PROGRESS_STORAGE_KEY, progress);
  return progress;
}

export function createLocalProgressRepository(): ProgressRepository {
  return {
    async get() {
      return load();
    },

    async markLessonCompleted(lessonId: string) {
      const progress = load();
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      return save(progress);
    },

    async saveQuizResult(lessonId: string, result: QuizResultDto) {
      const progress = load();
      const existing = progress.quizScores[lessonId];

      const next: LessonScoreDto = {
        bestScore: Math.max(existing?.bestScore ?? 0, result.percent),
        attempts: (existing?.attempts ?? 0) + 1,
        lastScore: result.percent,
        lastAttemptAt: result.completedAt,
      };

      progress.quizScores[lessonId] = next;
      // Completing a quiz also marks the lesson as completed.
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId);
      }
      return save(progress);
    },

    async setLastVisitedLesson(lessonId: string) {
      const progress = load();
      progress.lastVisitedLessonId = lessonId;
      return save(progress);
    },

    async reset() {
      return save(defaultProgress());
    },
  };
}
