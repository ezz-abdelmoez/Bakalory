"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

import type {
  QuizQuestionDto,
  QuizResultDto,
} from "@/lib/api/contracts/question";
import { useGradeQuiz } from "@/lib/api/modules/quiz/hooks";
import { useSaveQuizResult } from "@/lib/api/modules/progress/hooks";
import { QuestionCard } from "./question-card";
import { QuizProgress } from "./quiz-progress";
import { QuizNavigation } from "./quiz-navigation";
import { QuizResult } from "./quiz-result";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { ApiQueryError } from "@/components/shared/api-query-error";

export function QuizContainer({
  slug,
  lessonId,
  lessonTitle,
  questions,
}: {
  slug: string;
  lessonId: string;
  lessonTitle: string;
  questions: QuizQuestionDto[];
}) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [startedAt, setStartedAt] = useState(() => new Date().toISOString());
  const [result, setResult] = useState<QuizResultDto | null>(null);

  const gradeMutation = useGradeQuiz(slug);
  const saveMutation = useSaveQuizResult();

  const total = questions.length;
  const currentQuestion = questions[currentIndex];
  const selected = currentQuestion ? (answers[currentQuestion.id] ?? []) : [];
  const answeredCount = Object.values(answers).filter(
    (ids) => ids.length > 0
  ).length;
  const allAnswered = total > 0 && answeredCount === total;

  function handleSelect(questionId: string, selected: string[]) {
    setAnswers((previous) => ({ ...previous, [questionId]: selected }));
  }

  function handleSubmit() {
    gradeMutation.mutate(
      { lessonId, answers, startedAt },
      {
        onSuccess: (gradeResult) => {
          setResult(gradeResult);
          saveMutation.mutate({ lessonId, result: gradeResult });
        },
      }
    );
  }

  function handleRetry() {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
    setStartedAt(new Date().toISOString());
  }

  function handleReview() {
    if (result) {
      router.push(`/lessons/${slug}/quiz/result/${result.attemptId}`);
    }
  }

  if (total === 0) {
    return (
      <EmptyState
        title="هذا الدرس لا يحتوي على أسئلة بعد"
        description="ستُضاف أسئلة تفاعلية لهذا الدرس قريبًا."
      />
    );
  }

  if (result) {
    return <QuizResult result={result} onRetry={handleRetry} onReview={handleReview} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div>
          <p className="text-sm text-muted-foreground">اختبار</p>
          <h1 className="text-2xl font-extrabold tracking-tight">
            {lessonTitle}
          </h1>
        </div>
        <QuizProgress
          current={currentIndex + 1}
          total={total}
          answered={answeredCount}
        />
      </header>

      <QuestionCard
        question={currentQuestion}
        index={currentIndex}
        selected={selected}
        onSelect={(next) => handleSelect(currentQuestion.id, next)}
      />

      <QuizNavigation
        current={currentIndex + 1}
        total={total}
        onPrevious={() => setCurrentIndex((index) => Math.max(0, index - 1))}
        onNext={() =>
          setCurrentIndex((index) => Math.min(total - 1, index + 1))
        }
      />

      <div className="flex flex-col items-center gap-2 border-t pt-4">
        {gradeMutation.isError ? (
          <ApiQueryError
            error={gradeMutation.error}
            onRetry={handleSubmit}
          />
        ) : null}

        <Button
          onClick={handleSubmit}
          disabled={!allAnswered || gradeMutation.isPending}
          className="gap-2"
          size="lg"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          إرسال الإجابات
        </Button>

        {!allAnswered ? (
          <p className="text-sm text-muted-foreground" aria-live="polite">
            أجب عن جميع الأسئلة لتفعيل الإرسال (أجبت عن {answeredCount} من {total}).
          </p>
        ) : null}
      </div>
    </div>
  );
}
