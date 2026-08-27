import { Clock, FolderOpen, HelpCircle } from "lucide-react";

import type { LessonDto } from "@/lib/api/contracts/lesson";
import { difficultyLabels } from "@/types";
import { Badge } from "@/components/ui/badge";

export function LessonHeader({ lesson }: { lesson: LessonDto }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          <FolderOpen className="h-3.5 w-3.5 ms-0 me-1" aria-hidden="true" />
          {lesson.unitTitle}
        </Badge>
        <Badge>{difficultyLabels[lesson.difficulty]}</Badge>
        <Badge variant="secondary">الدرس {lesson.number}</Badge>
      </div>

      <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
        {lesson.title}
      </h1>

      <p className="max-w-3xl text-muted-foreground">{lesson.description}</p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          مدة القراءة: {lesson.duration} دقيقة
        </span>
        <span className="inline-flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          {lesson.questionCount} سؤال
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {lesson.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
