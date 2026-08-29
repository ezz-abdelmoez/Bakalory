import "server-only";

import { createServerApiClient } from "../../client/server-client";
import { lessonsApi } from "./endpoint";
import type {
  LessonDto,
  LessonFilter,
  LessonNavigationDto,
  LessonSummaryDto,
  ResourceDto,
} from "../../contracts/lesson";
import type { PageResult } from "../../contracts/common";
import type { QuizQuestionDto } from "../../contracts/question";

export async function listLessonsForServer(
  filter: LessonFilter = {}
): Promise<PageResult<LessonSummaryDto>> {
  const client = await createServerApiClient("student");
  return lessonsApi(client).list(filter);
}

export async function getLessonForServer(slug: string): Promise<LessonDto> {
  const client = await createServerApiClient("student");
  return lessonsApi(client).get(slug);
}

export async function getLessonResourcesForServer(
  slug: string
): Promise<ResourceDto[]> {
  const client = await createServerApiClient("student");
  return lessonsApi(client).resources(slug);
}

export async function getLessonQuizForServer(
  slug: string
): Promise<QuizQuestionDto[]> {
  const client = await createServerApiClient("student");
  return lessonsApi(client).quiz(slug);
}

export async function getLessonNavigationForServer(
  slug: string
): Promise<LessonNavigationDto> {
  const client = await createServerApiClient("student");
  return lessonsApi(client).navigation(slug);
}
