import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLessonForServer,
  getLessonQuizForServer,
  listLessonsForServer,
} from "@/lib/api/modules/lessons/server";
import { isNotFoundError } from "@/lib/api/transport/errors";
import { QuizContainer } from "@/components/quiz/quiz-container";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { PageContainer } from "@/components/shared/page-container";

export const dynamicParams = false;

export async function generateStaticParams() {
  const result = await listLessonsForServer({ pageSize: 100 });
  return result.items.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const lesson = await getLessonForServer(slug);
    return {
      title: `اختبار: ${lesson.title}`,
      description: `اختبار تفاعلي حول درس ${lesson.title}`,
    };
  } catch {
    return { title: "الاختبار" };
  }
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let lesson;
  let questions;

  try {
    [lesson, questions] = await Promise.all([
      getLessonForServer(slug),
      getLessonQuizForServer(slug),
    ]);
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <SiteBreadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الدروس", href: "/lessons" },
          { label: lesson.title, href: `/lessons/${lesson.slug}` },
          { label: "الاختبار" },
        ]}
      />

      <QuizContainer
        slug={slug}
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        questions={questions}
      />
    </PageContainer>
  );
}
