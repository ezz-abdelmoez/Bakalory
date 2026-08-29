"use client";

import { HeroSection } from "./hero-section";
import { StatsSection } from "./stats-section";
import { UnitsSection } from "./units-section";
import { LatestLessonsSection } from "./latest-lessons-section";
import { FeaturesSection } from "./features-section";
import { PageContainer } from "@/components/shared/page-container";

export function HomePage() {
  return (
    <PageContainer className="flex flex-col gap-16 py-8">
      <HeroSection />
      <StatsSection />
      <UnitsSection />
      <LatestLessonsSection />
      <FeaturesSection />
    </PageContainer>
  );
}
