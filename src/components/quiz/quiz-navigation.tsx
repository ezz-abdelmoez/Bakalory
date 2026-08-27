import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QuizNavigation({
  current,
  total,
  onPrevious,
  onNext,
}: {
  current: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const isFirst = current === 1;
  const isLast = current === total;

  return (
    <nav className="flex items-center justify-between gap-3">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={isFirst}
        className="gap-2"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
        السابق
      </Button>

      <span className="text-sm text-muted-foreground" aria-hidden="true">
        {current} / {total}
      </span>

      {!isLast ? (
        <Button onClick={onNext} className="gap-2">
          التالي
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </Button>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}
