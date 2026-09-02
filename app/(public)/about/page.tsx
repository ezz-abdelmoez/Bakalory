import type { Metadata } from "next";
import {
  BookOpen,
  ClipboardCheck,
  Code2,
  Download,
  GraduationCap,
  Network,
  Palette,
  ShieldCheck,
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
    "تعرف على منصة البرمجة والذكاء الاصطناعي: رسالتها، ووحدات الترم الأول، وكيفية الاستفادة منها.",
};

const units = [
  {
    icon: Network,
    title: "تكنولوجيا المعلومات والمجتمع",
    description:
      "تطور تكنولوجيا المعلومات، وأسس الذكاء الاصطناعي، وتطبيقاته وقضاياه الأخلاقية.",
  },
  {
    icon: ShieldCheck,
    title: "الأمن السيبراني",
    description:
      "التشفير والمصادقة، وأمن الشبكات، والاستجابة للحوادث وإدارة المخاطر.",
  },
  {
    icon: Code2,
    title: "تطبيقات الويب",
    description:
      "بنية تطبيقات الويب، وطرق الاتصال فيها، وأساسيات الواجهة الأمامية.",
  },
  {
    icon: Palette,
    title: "تصميم الويب والوسائط",
    description:
      "أنواع الوسائط، وتجربة المستخدم، وتقييم المواقع وتحسينها تكراريًا.",
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
    title: "2. عاين أو حمّل الملفات",
    description: "عاين ملفات PDF داخل المنصة أو حمّل الشرح والتمارين والشرائح للمراجعة.",
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
        description="البرمجة والذكاء الاصطناعي منصة عربية مجانية لمساعدة طلاب الصف الثاني بكالوريا على تعلّم المنهج بطريقة مبسطة ومنظمة."
      />

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold">رسالتنا</h2>
        <p className="max-w-3xl leading-relaxed text-muted-foreground">
          نقدم دروسًا عربية منظمة تغطي مقرر البرمجة والذكاء الاصطناعي للصف الثاني
          بكالوريا، من تكنولوجيا المعلومات والذكاء الاصطناعي إلى الأمن السيبراني
          وتطبيقات وتصميم الويب. وتجمع المنصة بين الشرح والأمثلة والملفات القابلة
          للتحميل والاختبارات التفاعلية لتساعد الطالب على التعلّم والمراجعة بثقة.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">وحدات الترم الأول</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
