import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { LessonCard } from "./lesson-card";

export function LessonGrid({ lessons }: { lessons: LessonSummaryDto[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} lesson={lesson} />
      ))}
    </div>
  );
}
