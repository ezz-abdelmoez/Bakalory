import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";

export function CompletedLessonsList({
  lessons,
}: {
  lessons: LessonSummaryDto[];
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <h2 className="text-lg font-bold">الدروس المكتملة</h2>

      {lessons.length > 0 ? (
        <ul className="flex flex-col divide-y">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link
                href={`/lessons/${lesson.slug}`}
                className="flex items-center gap-3 rounded-md px-2 py-3 transition-colors hover:bg-accent"
              >
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-success"
                  aria-hidden="true"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{lesson.title}</span>
                  <span className="text-xs text-muted-foreground">
                    الدرس {lesson.number} • {lesson.unitTitle}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          لم تكمل أي درس بعد.
        </p>
      )}
    </section>
  );
}
