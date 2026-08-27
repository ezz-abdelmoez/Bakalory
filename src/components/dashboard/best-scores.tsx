import Link from "next/link";
import { Trophy } from "lucide-react";

import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import type { LessonScoreDto } from "@/lib/api/contracts/progress";
import { Badge } from "@/components/ui/badge";

export function BestScores({
  entries,
}: {
  entries: { lesson: LessonSummaryDto; score: LessonScoreDto }[];
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <Trophy className="h-5 w-5 text-warning" aria-hidden="true" />
        أفضل النتائج
      </h2>

      {entries.length > 0 ? (
        <ul className="flex flex-col divide-y">
          {entries.map(({ lesson, score }) => (
            <li key={lesson.id}>
              <Link
                href={`/lessons/${lesson.slug}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-accent"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {score.attempts} محاولة • آخر محاولة {score.lastScore}%
                  </span>
                </div>
                <Badge variant="success" className="tabular-nums">
                  {score.bestScore}%
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          لا توجد نتائج اختبارات بعد.
        </p>
      )}
    </section>
  );
}
