export const quizKeys = {
  all: ["quiz"] as const,
  result: (attemptId: string) => [...quizKeys.all, "result", attemptId] as const,
};
