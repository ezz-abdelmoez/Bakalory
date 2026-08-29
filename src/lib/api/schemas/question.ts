import { z } from "zod";

export const questionTypeSchema = z.enum([
  "single-choice",
  "multiple-choice",
  "true-false",
]);

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

export const questionSchema = z.object({
  id: z.string().min(1),
  lessonId: z.string().min(1),
  type: questionTypeSchema,
  question: z.string().min(1),
  options: z.array(questionOptionSchema).min(2),
  correctAnswers: z.array(z.string().min(1)),
  explanation: z.string().optional(),
  points: z.number().int().positive(),
});

export const quizQuestionSchema = questionSchema.omit({ correctAnswers: true });

export const gradeQuizInputSchema = z.object({
  lessonId: z.string().min(1),
  answers: z.record(z.string().min(1), z.array(z.string().min(1))),
  startedAt: z.string().min(1),
});

export const gradedAnswerSchema = z.object({
  questionId: z.string().min(1),
  selectedOptionIds: z.array(z.string()),
  correctOptionIds: z.array(z.string()),
  isCorrect: z.boolean(),
  explanation: z.string().optional(),
});

export const quizResultSchema = z.object({
  attemptId: z.string().min(1),
  lessonId: z.string().min(1),
  score: z.number().nonnegative(),
  total: z.number().nonnegative(),
  percent: z.number().min(0).max(100),
  correctCount: z.number().int().nonnegative(),
  incorrectCount: z.number().int().nonnegative(),
  answers: z.array(gradedAnswerSchema),
  completedAt: z.string().min(1),
});
