import "server-only";

import { createServerApiClient } from "../../client/server-client";
import { quizApi } from "./endpoint";
import type { QuizResultDto } from "../../contracts/question";

export async function getQuizAttemptForServer(
  attemptId: string
): Promise<QuizResultDto> {
  const client = await createServerApiClient("student");
  return quizApi(client).getAttempt(attemptId);
}
