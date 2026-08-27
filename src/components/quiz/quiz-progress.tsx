import { Progress } from "@/components/ui/progress";

export function QuizProgress({
  current,
  total,
  answered,
}: {
  current: number;
  total: number;
  answered: number;
}) {
  const percent = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center justify-between text-sm"
        aria-live="polite"
      >
        <span className="font-semibold">
          السؤال {current} من {total}
        </span>
        <span className="text-muted-foreground">
          أجبت عن {answered} من {total}
        </span>
      </div>
      <Progress value={percent} aria-label={`التقدم: ${percent}%`} />
    </div>
  );
}
