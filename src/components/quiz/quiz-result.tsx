import { CheckCircle2, RotateCcw, Search } from "lucide-react";

import type { QuizResultDto } from "@/lib/api/contracts/question";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export function QuizResult({
  result,
  onRetry,
  onReview,
}: {
  result: QuizResultDto;
  onRetry: () => void;
  onReview: () => void;
}) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="flex flex-col items-center gap-6 rounded-xl border bg-card p-8 text-center"
    >
      <div className="text-5xl" aria-hidden="true">
        🎉
      </div>

      <h2 className="text-2xl font-extrabold">انتهى الاختبار</h2>

      <div className="flex flex-col items-center gap-2">
        <p className="text-5xl font-extrabold tabular-nums text-primary">
          {result.percent}%
        </p>
        <p className="text-muted-foreground">
          النتيجة: <span className="font-semibold">{result.score}</span> من{" "}
          <span className="font-semibold">{result.total}</span>
        </p>
      </div>

      <Progress value={result.percent} className="w-full max-w-sm" />

      <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          {result.correctCount} إجابة صحيحة
        </span>
        <span className="inline-flex items-center gap-1.5 text-destructive">
          <span aria-hidden="true">✗</span>
          {result.incorrectCount} إجابة خاطئة
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          إعادة الاختبار
        </Button>
        <Button onClick={onReview} className="gap-2">
          <Search className="h-4 w-4" aria-hidden="true" />
          مراجعة الإجابات
        </Button>
      </div>
    </div>
  );
}
