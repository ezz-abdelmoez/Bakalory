import Link from "next/link";
import { ArrowLeft, Clock, FileText, HelpCircle } from "lucide-react";

import type { LessonSummaryDto } from "@/lib/api/contracts/lesson";
import { difficultyLabels } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const difficultyVariant = {
  beginner: "success",
  intermediate: "secondary",
  advanced: "default",
} as const;

export function LessonCard({ lesson }: { lesson: LessonSummaryDto }) {
  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-muted-foreground">
            الدرس {lesson.number}
          </span>
          <Badge variant={difficultyVariant[lesson.difficulty]}>
            {difficultyLabels[lesson.difficulty]}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{lesson.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {lesson.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {lesson.duration} دقيقة
        </span>
        <span className="inline-flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
          {lesson.questionCount} سؤال
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FileText className="h-4 w-4" aria-hidden="true" />
          {lesson.resourceCount} ملف
        </span>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/lessons/${lesson.slug}`}>
            عرض الدرس
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
