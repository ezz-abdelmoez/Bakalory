import type { Metadata } from "next";

import { QuizResultPage } from "@/components/quiz/quiz-result-page";
import { PageContainer } from "@/components/shared/page-container";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";

export const metadata: Metadata = {
  title: "نتيجة الاختبار",
  description: "مراجعة إجاباتك ونتيجة الاختبار مع التصحيح المفصل.",
};

export default async function QuizAttemptResultPage({
  params,
}: {
  params: Promise<{ slug: string; attemptId: string }>;
}) {
  const { slug, attemptId } = await params;

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <SiteBreadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الدروس", href: "/lessons" },
          { label: "الاختبار", href: `/lessons/${slug}/quiz` },
          { label: "النتيجة" },
        ]}
      />
      <QuizResultPage slug={slug} attemptId={attemptId} />
    </PageContainer>
  );
}
