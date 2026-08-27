"use client";

import { Rocket } from "lucide-react";

import { useProgress } from "@/lib/api/modules/progress/hooks";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { OverallProgress } from "./overall-progress";
import { ContinueLearning } from "./continue-learning";
import { CompletedLessonsList } from "./completed-lessons-list";
import { BestScores } from "./best-scores";
import { RecentLessonsList } from "./recent-lessons-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShell() {
  const progress = useProgress();
  const lessons = useLessons({ pageSize: 100 });

  if (progress.isLoading || lessons.isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-xl" />
        ))}
      </div>
    );
  }

  const lessonItems = lessons.data?.items ?? [];
  const totalLessons = lessons.data?.meta.total ?? 0;

  const completedIds = progress.data?.completedLessons ?? [];
  const percent =
    totalLessons > 0
      ? Math.min(100, Math.round((completedIds.length / totalLessons) * 100))
      : 0;

  const completed = completedIds
    .map((id) => lessonItems.find((lesson) => lesson.id === id))
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));

  const lastVisited = lessonItems.find(
    (lesson) => lesson.id === progress.data?.lastVisitedLessonId
  );

  const bestScores = Object.entries(progress.data?.quizScores ?? {})
    .map(([lessonId, score]) => ({
      lesson: lessonItems.find((lesson) => lesson.id === lessonId),
      score,
    }))
    .filter(
      (
        entry
      ): entry is { lesson: NonNullable<typeof entry.lesson>; score: typeof entry.score } =>
        Boolean(entry.lesson)
    )
    .sort((a, b) => b.score.bestScore - a.score.bestScore);

  const recent = [...lessonItems]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);

  const isEmpty =
    completedIds.length === 0 &&
    !lastVisited &&
    bestScores.length === 0;

  if (isEmpty) {
    return (
      <EmptyState
        icon={Rocket}
        title="لم تبدأ بعد"
        description="ابدأ رحلتك التعليمية من الدرس الأول وتابع تقدمك هنا."
        actionHref="/lessons"
        actionLabel="ابدأ من الدرس الأول"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <OverallProgress
        percent={percent}
        completedCount={completedIds.length}
        totalCount={totalLessons}
      />

      <ContinueLearning lesson={lastVisited} />

      <div className="grid gap-4 lg:grid-cols-2">
        <CompletedLessonsList lessons={completed} />
        <BestScores entries={bestScores} />
      </div>

      <RecentLessonsList lessons={recent} />
    </div>
  );
}
