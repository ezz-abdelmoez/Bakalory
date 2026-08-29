"use client";

import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { lessonKeys } from "./keys";
import { studentApi } from "../../client/scoped-client";
import type { LessonFilter } from "../../contracts/lesson";

export const lessonQueries = {
  list: (filter: LessonFilter = {}) =>
    queryOptions({
      queryKey: lessonKeys.list(filter),
      queryFn: () => studentApi.lessons.list(filter),
      placeholderData: keepPreviousData,
      staleTime: 60 * 1000,
    }),
  detail: (slug: string) =>
    queryOptions({
      queryKey: lessonKeys.detail(slug),
      queryFn: () => studentApi.lessons.get(slug),
      enabled: Boolean(slug),
      staleTime: 60 * 1000,
    }),
  resources: (slug: string) =>
    queryOptions({
      queryKey: lessonKeys.resources(slug),
      queryFn: () => studentApi.lessons.resources(slug),
      enabled: Boolean(slug),
      staleTime: 60 * 1000,
    }),
  quiz: (slug: string) =>
    queryOptions({
      queryKey: lessonKeys.quiz(slug),
      queryFn: () => studentApi.lessons.quiz(slug),
      enabled: Boolean(slug),
      staleTime: 60 * 1000,
    }),
  navigation: (slug: string) =>
    queryOptions({
      queryKey: lessonKeys.nav(slug),
      queryFn: () => studentApi.lessons.navigation(slug),
      enabled: Boolean(slug),
      staleTime: 60 * 1000,
    }),
};

export function useLessons(filter: LessonFilter = {}) {
  return useQuery(lessonQueries.list(filter));
}

export function useLesson(slug: string) {
  return useQuery(lessonQueries.detail(slug));
}

export function useLessonResources(slug: string) {
  return useQuery(lessonQueries.resources(slug));
}

export function useLessonQuiz(slug: string) {
  return useQuery(lessonQueries.quiz(slug));
}

export function useLessonNavigation(slug: string) {
  return useQuery(lessonQueries.navigation(slug));
}
