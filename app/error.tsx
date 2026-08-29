"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-muted-foreground">
        نعتذر عن هذا الخلل. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.
      </p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>إعادة المحاولة</Button>
        <Button variant="outline" asChild>
          <Link href="/">العودة إلى الرئيسية</Link>
        </Button>
      </div>
    </main>
  );
}
