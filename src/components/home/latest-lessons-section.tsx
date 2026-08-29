"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import { LessonGridSkeleton } from "@/components/lessons/lesson-card-skeleton";
import { ApiQueryError } from "@/components/shared/api-query-error";
import { Button } from "@/components/ui/button";

export function LatestLessonsSection() {
  const { data, isLoading, isError, error, refetch } = useLessons({
    sort: "newest",
    pageSize: 4,
  });

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold">أحدث الدروس</h2>
          <p className="text-muted-foreground">
            ابدأ من أحدث الدروس المضافة إلى المنصة.
          </p>
        </div>
        <Button asChild variant="ghost">
          <Link href="/lessons">
            جميع الدروس
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <LessonGridSkeleton count={4} />
      ) : isError ? (
        <ApiQueryError error={error} onRetry={() => refetch()} />
      ) : data && data.items.length > 0 ? (
        <LessonGrid lessons={data.items} />
      ) : null}
    </section>
  );
}
