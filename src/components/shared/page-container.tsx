import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("container mx-auto w-full max-w-6xl px-4", className)}>
      {children}
    </div>
  );
}
