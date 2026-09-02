import type { Metadata } from "next";

import { LessonsPage } from "@/components/lessons/lessons-page";

export const metadata: Metadata = {
  title: "الدروس",
  description:
    "استعرض جميع دروس البرمجة والذكاء الاصطناعي لطلاب الصف الثاني بكالوريا: الذكاء الاصطناعي، الأمن السيبراني، وتطبيقات الويب.",
};

export default function LessonsRoute() {
  return <LessonsPage />;
}
