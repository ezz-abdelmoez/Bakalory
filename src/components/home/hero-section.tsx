"use client";

import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { useHomeContent } from "@/lib/api/modules/home/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function HeroSection() {
  const { data, isLoading, isError } = useHomeContent();

  if (isLoading) {
    return (
      <section className="flex flex-col items-center gap-6 py-16 text-center">
        <Skeleton className="h-12 w-2/3 max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
        <Skeleton className="h-5 w-3/4 max-w-xl" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-36" />
        </div>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          تعلم البرمجة بطريقة أسهل
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          منصة عربية لطلاب السنة الثانية باكالوريا لتعلم الخوارزميات وPython وقواعد
          البيانات.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center gap-6 py-16 text-center md:py-24">
      <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
        مخصصة لطلاب 2ème Bac
      </div>

      <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {data.heroTitle}
      </h1>

      <p className="max-w-2xl text-lg text-muted-foreground">
        {data.heroSubtitle}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/lessons/introduction-to-algorithms">{data.primaryCta}</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/lessons">
            <BookOpen className="h-5 w-5" aria-hidden="true" />
            {data.secondaryCta}
          </Link>
        </Button>
      </div>

      <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        {data.benefits.slice(0, 4).map((benefit) => (
          <li key={benefit} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            {benefit}
          </li>
        ))}
      </ul>
    </section>
  );
}
