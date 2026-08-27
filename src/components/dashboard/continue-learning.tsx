import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";

import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { Button } from "@/components/ui/button";

export function ContinueLearning({ lesson }: { lesson?: LessonSummaryDto }) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/5 p-6">
      <h2 className="flex items-center gap-2 text-lg font-bold">
        <PlayCircle className="h-5 w-5 text-primary" aria-hidden="true" />
        أكمل من حيث توقفت
      </h2>

      {lesson ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{lesson.title}</p>
            <p className="text-sm text-muted-foreground">
              الدرس {lesson.number} • {lesson.unitTitle}
            </p>
          </div>
          <Button asChild className="gap-2">
            <Link href={`/lessons/${lesson.slug}`}>
              متابعة الدرس
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          ابدأ من الدرس الأول لتسجيل تقدمك.
        </p>
      )}
    </section>
  );
}
