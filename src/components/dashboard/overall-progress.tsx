import { Progress } from "@/components/ui/progress";

export function OverallProgress({
  percent,
  completedCount,
  totalCount,
}: {
  percent: number;
  completedCount: number;
  totalCount: number;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">تقدمك في المادة</h2>
        <span className="text-2xl font-extrabold tabular-nums text-primary">
          {percent}%
        </span>
      </div>
      <Progress value={percent} aria-label={`التقدم الإجمالي: ${percent}%`} />
      <p className="text-sm text-muted-foreground">
        أكملت {completedCount} من أصل {totalCount} درسًا.
      </p>
    </section>
  );
}
