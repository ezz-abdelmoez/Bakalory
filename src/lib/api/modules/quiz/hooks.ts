"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { quizKeys } from "./keys";
import { progressKeys } from "../progress/keys";
import { studentApi } from "../../client/scoped-client";
import type { GradeQuizInput } from "../../contracts/question";

export function useGradeQuiz(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: GradeQuizInput) => studentApi.quiz.grade(slug, input),
    onSuccess: (result) => {
      queryClient.setQueryData(quizKeys.result(result.attemptId), result);
      queryClient.invalidateQueries({ queryKey: progressKeys.all });
    },
  });
}

export function useQuizAttempt(attemptId: string) {
  return useQuery({
    queryKey: quizKeys.result(attemptId),
    queryFn: () => studentApi.quiz.getAttempt(attemptId),
    enabled: Boolean(attemptId),
    staleTime: 60 * 1000,
  });
}
