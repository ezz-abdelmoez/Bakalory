import Link from "next/link";
import {
  ArrowLeft,
  Code2,
  Database,
  Network,
  Palette,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import type { UnitDto } from "@/lib/api/contracts/unit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const unitIcons: Record<string, LucideIcon> = {
  Workflow,
  Code2,
  Database,
  Network,
  Palette,
  ShieldCheck,
};

const iconColorClasses: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  green:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  amber:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
};

export function UnitCard({ unit }: { unit: UnitDto }) {
  const Icon = unitIcons[unit.icon] ?? Workflow;

  return (
    <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div
          className={`mb-2 inline-flex w-fit rounded-lg p-3 ${iconColorClasses[unit.color] ?? iconColorClasses.blue}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-lg">{unit.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {unit.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
        {unit.lessonCount > 0 ? (
          <>
            <span>{unit.lessonCount} دروس منشورة</span>
            <span aria-hidden="true">•</span>
            <span>{unit.questionCount} سؤال</span>
          </>
        ) : (
          <span>المحتوى قيد الإعداد</span>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild variant="outline" className="w-full">
          <Link href={`/units/${unit.slug}`}>
            استعرض الوحدة
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
