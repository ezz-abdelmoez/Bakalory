"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, RotateCcw } from "lucide-react";

import { useQuizAttempt } from "@/lib/api/modules/quiz/hooks";
import { useLessonQuiz, useLessonNavigation } from "@/lib/api/modules/lessons/hooks";
import { AnswerReview } from "./answer-review";
import { Button } from "@/components/ui/button";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function QuizResultPage({
  slug,
  attemptId,
}: {
  slug: string;
  attemptId: string;
}) {
  const attempt = useQuizAttempt(attemptId);
  const quiz = useLessonQuiz(slug);
  const navigation = useLessonNavigation(slug);

  if (attempt.isLoading || quiz.isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (attempt.isError) {
    return (
      <ApiQueryError
        error={attempt.error}
        onRetry={() => attempt.refetch()}
      />
    );
  }

  if (!attempt.data) {
    return (
      <EmptyState
        title="لم يتم العثور على المحاولة"
        description="قد تكون هذه المحاولة انتهت صلاحيتها أو غير موجودة."
        actionHref={`/lessons/${slug}/quiz`}
        actionLabel="العودة إلى الاختبار"
      />
    );
  }

  const result = attempt.data;
  const questions = quiz.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center">
        <h1 className="text-xl font-extrabold">مراجعة الإجابات</h1>
        <p className="text-3xl font-extrabold tabular-nums text-primary">
          {result.percent}% — {result.score} / {result.total}
        </p>
        <p className="text-sm text-muted-foreground">
          {result.correctCount} إجابة صحيحة • {result.incorrectCount} إجابة خاطئة
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {result.answers.map((graded, index) => {
          const question = questions.find((q) => q.id === graded.questionId);
          if (!question) return null;
          return (
            <AnswerReview
              key={graded.questionId}
              question={question}
              graded={graded}
              index={index}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t pt-6">
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/lessons/${slug}/quiz`}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            إعادة الاختبار
          </Link>
        </Button>
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/lessons/${slug}`}>
            <BookOpen className="h-4 w-4" aria-hidden="true" />
            العودة إلى الدرس
          </Link>
        </Button>
        {navigation.data?.next ? (
          <Button asChild className="gap-2">
            <Link href={`/lessons/${navigation.data.next.slug}`}>
              الدرس التالي
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}
