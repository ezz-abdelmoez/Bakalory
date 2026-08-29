import { z } from "zod";

export const lessonScoreSchema = z.object({
  bestScore: z.number().min(0).max(100),
  attempts: z.number().int().nonnegative(),
  lastScore: z.number().min(0).max(100),
  lastAttemptAt: z.string().min(1),
});

export const progressSchema = z.object({
  version: z.literal(1),
  completedLessons: z.array(z.string().min(1)),
  quizScores: z.record(z.string().min(1), lessonScoreSchema),
  lastVisitedLessonId: z.string().optional(),
  updatedAt: z.string().min(1),
});
