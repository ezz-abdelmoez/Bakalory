import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Code2,
  Database,
  Network,
  Palette,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import {
  getUnitForServer,
  listUnitsForServer,
} from "@/lib/api/modules/units/server";
import { isNotFoundError } from "@/lib/api/transport/errors";
import { SiteBreadcrumbs } from "@/components/layout/site-breadcrumbs";
import { LessonGrid } from "@/components/lessons/lesson-grid";
import { PageContainer } from "@/components/shared/page-container";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamicParams = false;

const unitIcons: Record<string, LucideIcon> = {
  Workflow,
  Code2,
  Database,
  Network,
  Palette,
  ShieldCheck,
};

export async function generateStaticParams() {
  const units = await listUnitsForServer();
  return units.map((unit) => ({ slug: unit.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const unit = await getUnitForServer(slug);
    return {
      title: unit.title,
      description: unit.description,
    };
  } catch {
    return { title: "الوحدة" };
  }
}

export default async function UnitDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let unit;
  try {
    unit = await getUnitForServer(slug);
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }

  const Icon = unitIcons[unit.icon] ?? Workflow;

  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <SiteBreadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الوحدات", href: "/units" },
          { label: unit.title },
        ]}
      />

      <div className="flex flex-col gap-4 rounded-xl border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {unit.title}
            </h1>
            <p className="text-muted-foreground">{unit.description}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {unit.lessonCount > 0
                ? `${unit.lessonCount} دروس منشورة • ${unit.questionCount} سؤال`
                : "المحتوى قيد الإعداد"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">دروس الوحدة</h2>
        {unit.lessons.length > 0 ? (
          <LessonGrid lessons={unit.lessons} />
        ) : (
          <EmptyState
            title="المحتوى قيد الإعداد"
            description="يُجهّز محتوى هذه الوحدة ومواردها واختباراتها التفاعلية حاليًا."
          />
        )}
      </div>
    </PageContainer>
  );
}
