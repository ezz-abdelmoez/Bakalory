import type { ApiClient } from "../../transport/types";
import {
  gradeQuizInputSchema,
  quizResultSchema,
} from "../../schemas/question";
import type { GradeQuizInput, QuizResultDto } from "../../contracts/question";

export const quizApi = (client: ApiClient) => ({
  grade: (slug: string, input: GradeQuizInput) =>
    client.post<QuizResultDto, GradeQuizInput>(
      `/v1/lessons/${slug}/quiz/grade`,
      input,
      {
        requestSchema: gradeQuizInputSchema,
        responseSchema: quizResultSchema,
      }
    ),
  getAttempt: (attemptId: string) =>
    client.get<QuizResultDto>(`/v1/quiz/attempts/${attemptId}`, {
      responseSchema: quizResultSchema,
    }),
});
