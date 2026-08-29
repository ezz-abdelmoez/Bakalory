"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { progressKeys } from "./keys";
import { getProgressRepository } from "@/lib/progress/progress-repository";
import type { QuizResultDto } from "../../contracts/question";

const progressRepository = getProgressRepository();

export function useProgress() {
  return useQuery({
    queryKey: progressKeys.root(),
    queryFn: () => progressRepository.get(),
    staleTime: 30 * 1000,
  });
}

export function useMarkLessonCompleted() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) =>
      progressRepository.markLessonCompleted(lessonId),
    onSuccess: (progress) => {
      queryClient.setQueryData(progressKeys.root(), progress);
    },
  });
}

export function useSaveQuizResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      lessonId,
      result,
    }: {
      lessonId: string;
      result: QuizResultDto;
    }) => progressRepository.saveQuizResult(lessonId, result),
    onSuccess: (progress) => {
      queryClient.setQueryData(progressKeys.root(), progress);
    },
  });
}

export function useSetLastVisitedLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lessonId: string) =>
      progressRepository.setLastVisitedLesson(lessonId),
    onSuccess: (progress) => {
      queryClient.setQueryData(progressKeys.root(), progress);
    },
  });
}
