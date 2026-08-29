import type { Metadata } from "next";
import {
  BookOpen,
  ClipboardCheck,
  Code2,
  Database,
  Download,
  GraduationCap,
  Workflow,
} from "lucide-react";

import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "حول المنصة",
  description:
    "تعرف على منصة برمجة 2 باك: رسالتها، وحداتها الدراسية، وكيفية الاستفادة منها.",
};

const units = [
  {
    icon: Workflow,
    title: "الخوارزميات",
    description:
      "مفهوم الخوارزمية، المخططات الانسيابية، وخوارزميات الترتيب والبحث.",
  },
  {
    icon: Code2,
    title: "البرمجة بلغة Python",
    description:
      "المتغيرات، الجمل الشرطية، الحلقات التكرارية، والدوال والوحدات.",
  },
  {
    icon: Database,
    title: "قواعد البيانات",
    description: "أساسيات قواعد البيانات العلائقية ولغة SQL والاستعلامات.",
  },
];

const steps = [
  {
    icon: BookOpen,
    title: "1. اقرأ الدرس",
    description: "ابدأ بقراءة الدرس وفهم المفاهيم الأساسية مع الأمثلة.",
  },
  {
    icon: Download,
    title: "2. حمّل الملفات",
    description: "استخدم ملفات PDF والتمارين والشرائح للمراجعة والتطبيق.",
  },
  {
    icon: ClipboardCheck,
    title: "3. اختبر نفسك",
    description: "أجب عن أسئلة الاختبار واحصل على نتيجتك مع تصحيح مفصل.",
  },
  {
    icon: GraduationCap,
    title: "4. تابع تقدمك",
    description: "راقب تقدمك من لوحة التحكم وأكمل من حيث توقفت.",
  },
];

export default function AboutPage() {
  return (
    <PageContainer className="flex flex-col gap-8 py-8">
      <PageHeader
        title="حول المنصة"
        description="برمجة 2 باك منصة عربية مجانية لمساعدة طلاب السنة الثانية باكالوريا على تعلم البرمجة بطريقة مبسطة ومنظمة."
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">رسالتنا</h2>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          نؤمن بأن تعلم البرمجة لا يجب أن يكون معقدًا. لذلك نقدم دروسًا مبسطة
          باللغة العربية تغطي منهج مادة البرمجة للسنة الثانية باكالوريا، مع أمثلة
          تطبيقية وملفات قابلة للتحميل واختبارات تفاعلية تساعدك على التثبت من
          فهمك في كل خطوة.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">الوحدات الدراسية</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {units.map((unit) => (
            <Card key={unit.title}>
              <CardHeader>
                <div className="mb-2 inline-flex w-fit rounded-lg bg-primary/10 p-3">
                  <unit.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <CardTitle>{unit.title}</CardTitle>
                <CardDescription>{unit.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">كيف تتعلم معنا؟</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {steps.map((step) => (
            <Card key={step.title}>
              <CardContent className="flex items-start gap-4 pt-6">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <step.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
