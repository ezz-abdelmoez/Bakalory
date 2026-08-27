import type { Metadata } from "next";

import { LessonsPage } from "@/components/lessons/lessons-page";

export const metadata: Metadata = {
  title: "الدروس",
  description:
    "استعرض جميع دروس البرمجة لطلاب السنة الثانية باكالوريا: الخوارزميات، Python، وقواعد البيانات.",
};

export default function LessonsRoute() {
  return <LessonsPage />;
}
