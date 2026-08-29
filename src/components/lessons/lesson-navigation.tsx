import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { LessonNavigationDto } from "@/lib/api/contracts/lesson";
import { Button } from "@/components/ui/button";

export function LessonNavigation({ navigation }: { navigation: LessonNavigationDto }) {
  const { previous, next } = navigation;

  return (
    <nav
      aria-label="التنقل بين الدروس"
      className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between"
    >
      {previous ? (
        <Button asChild variant="outline" className="sm:max-w-xs">
          <Link href={`/lessons/${previous.slug}`} className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span className="flex flex-col items-start leading-tight">
              <span className="text-xs text-muted-foreground">الدرس السابق</span>
              <span className="truncate">{previous.title}</span>
            </span>
          </Link>
        </Button>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Button asChild className="sm:max-w-xs">
          <Link href={`/lessons/${next.slug}`} className="flex items-center gap-2">
            <span className="flex flex-col items-end leading-tight">
              <span className="text-xs opacity-80">الدرس التالي</span>
              <span className="truncate">{next.title}</span>
            </span>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </nav>
  );
}
