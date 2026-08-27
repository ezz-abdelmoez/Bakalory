import Link from "next/link";
import { ClipboardCheck } from "lucide-react";

import type {
  LessonDto,
  LessonNavigationDto,
  ResourceDto,
} from "@/lib/api/contracts/lesson";
import { LessonHeader } from "./lesson-header";
import { LessonContent } from "./lesson-content";
import { LessonResources } from "./lesson-resources";
import { LessonNavigation } from "./lesson-navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function LessonDetail({
  lesson,
  resources,
  navigation,
}: {
  lesson: LessonDto;
  resources: ResourceDto[];
  navigation: LessonNavigationDto;
}) {
  return (
    <div className="flex flex-col gap-10">
      <LessonHeader lesson={lesson} />

      <LessonContent content={lesson.content} />

      {lesson.questionCount > 0 ? (
        <section className="flex flex-col items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <ClipboardCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            اختبر معلوماتك
          </h2>
          <p className="text-muted-foreground">
            أجب عن {lesson.questionCount} سؤال حول هذا الدرس واحصل على نتيجتك فورًا
            مع تصحيح مفصل.
          </p>
          <Button asChild>
            <Link href={`/lessons/${lesson.slug}/quiz`}>ابدأ الاختبار</Link>
          </Button>
        </section>
      ) : null}

      <Separator />

      <LessonResources resources={resources} />

      <LessonNavigation navigation={navigation} />
    </div>
  );
}
