import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLessonForServer,
  getLessonNavigationForServer,
  getLessonResourcesForServer,
  listLessonsForServer,
} from "@/lib/api/modules/lessons/server";
import { isNotFoundError } from "@/lib/api/transport/errors";
import { LessonDetail } from "@/components/lessons/lesson-detail";
import { LessonLastVisited } from "@/components/lessons/lesson-last-visited";
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
      title: lesson.title,
      description: lesson.description,
      openGraph: {
        title: lesson.title,
        description: lesson.description,
        type: "article",
      },
    };
  } catch {
    return { title: "الدرس" };
  }
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let lesson;
  let resources;
  let navigation;

  try {
    [lesson, resources, navigation] = await Promise.all([
      getLessonForServer(slug),
      getLessonResourcesForServer(slug),
      getLessonNavigationForServer(slug),
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
          { label: lesson.unitTitle, href: `/units/${lesson.unitSlug}` },
          { label: lesson.title },
        ]}
      />

      <LessonDetail
        lesson={lesson}
        resources={resources}
        navigation={navigation}
      />

      <LessonLastVisited lessonId={lesson.id} />
    </PageContainer>
  );
}
