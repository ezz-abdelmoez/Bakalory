import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <p className="text-7xl font-extrabold text-primary" aria-hidden="true">
        404
      </p>
      <h1 className="text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="max-w-md text-muted-foreground">
        يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
      </p>
      <Button asChild>
        <Link href="/">العودة إلى الرئيسية</Link>
      </Button>
    </main>
  );
}
