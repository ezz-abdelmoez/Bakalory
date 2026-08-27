import { z } from "zod";
import type { ApiClient } from "../../transport/types";
import { pageResultSchema } from "../../schemas/common";
import {
  lessonSchema,
  lessonSummarySchema,
  lessonNavigationSchema,
  resourceSchema,
} from "../../schemas/course";
import { questionSchema, quizQuestionSchema } from "../../schemas/question";
import type {
  LessonDto,
  LessonFilter,
  LessonNavigationDto,
  LessonSummaryDto,
  ResourceDto,
} from "../../contracts/lesson";
import type { PageResult } from "../../contracts/common";
import type { QuestionDto, QuizQuestionDto } from "../../contracts/question";

export type LessonFilterQuery = Record<string, string | number | boolean | undefined>;

export const lessonsApi = (client: ApiClient) => ({
  list: (filter: LessonFilter = {}) =>
    client.get<PageResult<LessonSummaryDto>>("/v1/lessons", {
      query: filter as LessonFilterQuery,
      responseSchema: pageResultSchema(lessonSummarySchema),
    }),
  get: (slug: string) =>
    client.get<LessonDto>(`/v1/lessons/${slug}`, {
      responseSchema: lessonSchema,
    }),
  resources: (slug: string) =>
    client.get<ResourceDto[]>(`/v1/lessons/${slug}/resources`, {
      responseSchema: z.array(resourceSchema),
    }),
  questions: (slug: string) =>
    client.get<QuestionDto[]>(`/v1/lessons/${slug}/questions`, {
      responseSchema: z.array(questionSchema),
    }),
  quiz: (slug: string) =>
    client.get<QuizQuestionDto[]>(`/v1/lessons/${slug}/quiz`, {
      responseSchema: z.array(quizQuestionSchema),
    }),
  navigation: (slug: string) =>
    client.get<LessonNavigationDto>(`/v1/lessons/next/${slug}`, {
      responseSchema: lessonNavigationSchema,
    }),
});
