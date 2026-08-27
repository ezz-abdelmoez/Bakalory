import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";

export default function LessonNotFound() {
  return (
    <PageContainer className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-2xl font-bold">الدرس غير موجود</h1>
      <p className="max-w-md text-muted-foreground">
        يبدو أن هذا الدرس غير موجود أو تم حذفه. تصفح باقي الدروس المتاحة.
      </p>
      <Button asChild>
        <Link href="/lessons">استعرض الدروس</Link>
      </Button>
    </PageContainer>
  );
}
