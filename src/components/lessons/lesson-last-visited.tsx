"use client";

import { useEffect } from "react";

import { useSetLastVisitedLesson } from "@/lib/api/modules/progress/hooks";

export function LessonLastVisited({ lessonId }: { lessonId: string }) {
  const { mutate } = useSetLastVisitedLesson();

  useEffect(() => {
    mutate(lessonId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  return null;
}
