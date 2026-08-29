import type { Metadata } from "next";

import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PageHeader } from "@/components/shared/page-header";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "لوحة التقدم",
  description: "تابع تقدمك في المادة، دروسك المكتملة، وأفضل نتائجك في الاختبارات.",
};

export default function DashboardRoute() {
  return (
    <PageContainer className="flex flex-col gap-6 py-8">
      <PageHeader
        title="لوحة التقدم"
        description="نظرة شاملة على تقدمك في تعلم البرمجة."
      />
      <DashboardShell />
    </PageContainer>
  );
}
