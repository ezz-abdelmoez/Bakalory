"use client";

import { FileText, HelpCircle, Layers, BookOpen } from "lucide-react";

import { useUnits } from "@/lib/api/modules/units/hooks";
import { useLessons } from "@/lib/api/modules/lessons/hooks";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-4">
      <div className="rounded-lg bg-primary/10 p-3">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <div>
        <div className="text-2xl font-extrabold tabular-nums">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const units = useUnits();
  // Fetch all published lessons once to derive question/file totals.
  const lessons = useLessons({ pageSize: 100 });

  if (units.isLoading || lessons.isLoading) {
    return (
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-24 rounded-xl" />
        ))}
      </section>
    );
  }

  const lessonItems = lessons.data?.items ?? [];
  const totalLessons = lessons.data?.meta.total ?? lessonItems.length;
  const totalQuestions = lessonItems.reduce(
    (sum, lesson) => sum + lesson.questionCount,
    0
  );
  const totalFiles = lessonItems.reduce(
    (sum, lesson) => sum + lesson.resourceCount,
    0
  );
  const totalUnits = units.data?.length ?? 0;

  return (
    <section aria-label="إحصائيات المنصة">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={BookOpen} label="درس" value={totalLessons} />
        <StatCard icon={HelpCircle} label="سؤال" value={totalQuestions} />
        <StatCard icon={FileText} label="ملف" value={totalFiles} />
        <StatCard icon={Layers} label="وحدة" value={totalUnits} />
      </div>
    </section>
  );
}
