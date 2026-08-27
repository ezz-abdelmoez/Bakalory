import type {
  GradedAnswerDto,
  QuestionDto,
  QuizResultDto,
} from "@/lib/api/contracts/question";

/**
 * Pure grading engine — no React, no I/O.
 *
 * Rules:
 * - `single-choice` / `true-false`: exactly one selected id must equal the
 *   single correct id.
 * - `multiple-choice`: set equality — all correct selected, no incorrect
 *   selected (order-insensitive).
 * - Unanswered questions are marked incorrect.
 * - `score` is the sum of `points` for correct answers; `total` is the sum of
 *   all points; `percent` is rounded.
 * - Output preserves question order and includes explanations for review.
 *
 * This function is only invoked by the mock transport (and the unit tests).
 * In HTTP mode the backend grades server-side and the client only renders a
 * `QuizResultDto`.
 */
export function gradeQuiz(
  questions: QuestionDto[],
  answers: Record<string, string[]>
): QuizResultDto {
  const graded: GradedAnswerDto[] = [];
  let score = 0;
  let total = 0;
  let correctCount = 0;

  for (const question of questions) {
    const selected = answers[question.id] ?? [];
    const correct = question.correctAnswers;
    total += question.points;

    const isCorrect = isAnswerCorrect(question.type, selected, correct);
    if (isCorrect) {
      score += question.points;
      correctCount += 1;
    }

    graded.push({
      questionId: question.id,
      selectedOptionIds: [...selected],
      correctOptionIds: [...correct],
      isCorrect,
      explanation: question.explanation,
    });
  }

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;

  return {
    attemptId: generateAttemptId(),
    lessonId: questions[0]?.lessonId ?? "",
    score,
    total,
    percent,
    correctCount,
    incorrectCount: graded.length - correctCount,
    answers: graded,
    completedAt: new Date().toISOString(),
  };
}

export function isAnswerCorrect(
  type: QuestionDto["type"],
  selected: string[],
  correct: string[]
): boolean {
  if (selected.length === 0) return false;

  if (type === "multiple-choice") {
    if (selected.length !== correct.length) return false;
    const correctSet = new Set(correct);
    return selected.every((id) => correctSet.has(id));
  }

  // single-choice / true-false: exactly one selected id must equal the single correct id.
  return selected.length === 1 && selected[0] === correct[0];
}

function generateAttemptId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
