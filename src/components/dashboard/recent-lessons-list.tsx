import Link from "next/link";
import { History } from "lucide-react";

import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function RecentLessonsList({
  lessons,
}: {
  lessons: LessonSummaryDto[];
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <History className="h-5 w-5 text-primary" aria-hidden="true" />
        أحدث الدروس
      </h2>

      {lessons.length > 0 ? (
        <ul className="flex flex-col divide-y">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/lessons/${lesson.slug}`}
                className="flex items-center justify-between gap-3 rounded-md px-2 py-3 transition-colors hover:bg-accent"
              >
                <span className="font-medium">{lesson.title}</span>
                <span className="text-xs text-muted-foreground">
                  الدرس {lesson.number}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          لا توجد دروس حديثة.
        </p>
      )}
    </section>
  );
}
