"use client";

import {
  BookOpen,
  CheckCircle2,
  Download,
  FileText,
  ListChecks,
  Presentation,
  type LucideIcon,
} from "lucide-react";

import { useHomeContent } from "@/lib/api/modules/home/hooks";
import { Skeleton } from "@/components/ui/skeleton";

const featureIcons: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  Presentation,
  ListChecks,
  CheckCircle2,
  Download,
};

export function FeaturesSection() {
  const { data, isLoading } = useHomeContent();

  if (isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-xl" />
        ))}
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">لماذا تتعلم معنا؟</h2>
        <p className="text-muted-foreground">
          كل ما تحتاجه لإتقان البرمجة في مكان واحد.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((feature) => {
          const Icon = featureIcons[feature.icon] ?? BookOpen;
          return (
            <div
              key={feature.title}
              className="flex flex-col gap-2 rounded-xl border bg-card p-5"
            >
              <div className="rounded-lg bg-primary/10 p-2.5 w-fit">
                <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
