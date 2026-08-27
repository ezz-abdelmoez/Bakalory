import type { ProgressDto } from "@/lib/api/contracts/progress";
import type { QuizResultDto } from "@/lib/api/contracts/question";
import { apiConfig } from "@/lib/api/config";
import { createLocalProgressRepository } from "./local-progress-repository";

export interface ProgressRepository {
  get(): Promise<ProgressDto>;
  markLessonCompleted(lessonId: string): Promise<ProgressDto>;
  saveQuizResult(lessonId: string, result: QuizResultDto): Promise<ProgressDto>;
  setLastVisitedLesson(lessonId: string): Promise<ProgressDto>;
  reset(): Promise<ProgressDto>;
}

/**
 * Swapping the backend later only changes this factory: switch
 * `NEXT_PUBLIC_PROGRESS_MODE` to `api` and implement the remote repository.
 */
export function getProgressRepository(): ProgressRepository {
  if (apiConfig.progressMode === "api") {
    return remoteProgressRepository();
  }
  return createLocalProgressRepository();
}

function remoteProgressRepository(): ProgressRepository {
  // Future: fetch('/v1/progress', …). Until the backend exists, the local
  // repository keeps the full experience functional.
  return createLocalProgressRepository();
}
