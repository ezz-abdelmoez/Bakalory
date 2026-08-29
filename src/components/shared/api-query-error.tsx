"use client";

import { AlertTriangle, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isApiError } from "@/lib/api/transport/errors";

export function ApiQueryError({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const apiError = isApiError(error) ? error : null;
  const isNotFound = apiError?.status === 404;
  const isContractError = apiError?.code === "INVALID_API_RESPONSE";

  const title = isNotFound
    ? "غير موجود"
    : isContractError
      ? "البيانات غير مطابقة للعقد"
      : "تعذر تحميل البيانات";

  const detail = apiError?.detail ?? "حدث خطأ أثناء الاتصال، حاول مرة أخرى.";

  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center"
    >
      <div className="rounded-full bg-destructive/10 p-4">
        {isNotFound ? (
          <FileQuestion className="h-8 w-8 text-destructive" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
        )}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-md text-sm text-muted-foreground">{detail}</p>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline" className="mt-2">
          إعادة المحاولة
        </Button>
      ) : null}
    </div>
  );
}
