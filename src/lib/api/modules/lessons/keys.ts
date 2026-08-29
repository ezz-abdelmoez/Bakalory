import type { LessonFilter } from "../../contracts/lesson";

/** Deterministic key for a filter object so identical filters share a cache entry. */
export function normalizedFilter(filter: LessonFilter): LessonFilter {
  const out: LessonFilter = {};
  const entries = Object.entries(filter).filter(
    ([, value]) => value !== undefined && value !== ""
  );
  entries.sort(([a], [b]) => a.localeCompare(b));
  for (const [key, value] of entries) {
    (out as Record<string, unknown>)[key] = value;
  }
  return out;
}

export const lessonKeys = {
  all: ["lessons"] as const,
  lists: () => [...lessonKeys.all, "list"] as const,
  list: (filter: LessonFilter = {}) =>
    [...lessonKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...lessonKeys.all, "detail", slug] as const,
  resources: (slug: string) => [...lessonKeys.detail(slug), "resources"] as const,
  questions: (slug: string) => [...lessonKeys.detail(slug), "questions"] as const,
  quiz: (slug: string) => [...lessonKeys.detail(slug), "quiz"] as const,
  nav: (slug: string) => [...lessonKeys.all, "navigation", slug] as const,
};
