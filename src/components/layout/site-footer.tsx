import Link from "next/link";
import { GraduationCap } from "lucide-react";

import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="font-extrabold">{siteConfig.name}</span>
          </Link>
          <p className="max-w-xs text-center text-sm text-muted-foreground md:text-start">
            منصة عربية لتعلم البرمجة لطلاب السنة الثانية باكالوريا.
          </p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="روابط سفلية">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {year} {siteConfig.name} — جميع الحقوق محفوظة.
      </div>
    </footer>
  );
}
