export const siteConfig = {
  name: "برمجة 2 باك",
  shortName: "برمجة 2 باك",
  description:
    "منصة عربية مجانية لتعلم البرمجة لطلاب السنة الثانية باكالوريا: دروس مبسطة، ملفات قابلة للتحميل، واختبارات تفاعلية.",
  url: "https://programming2bac.example.com",
  locale: "ar_MA",
  keywords: [
    "برمجة",
    "باكالوريا",
    "2 باك",
    "خوارزميات",
    "Python",
    "SQL",
    "قواعد البيانات",
    "تعلم البرمجة",
    "الثانية باكالوريا",
  ] as string[],
  nav: [
    { title: "الرئيسية", href: "/" },
    { title: "الدروس", href: "/lessons" },
    { title: "الوحدات", href: "/units" },
    { title: "لوحة التقدم", href: "/dashboard" },
    { title: "حول المنصة", href: "/about" },
  ] as { title: string; href: string }[],
  links: {
    github: "https://github.com",
  },
} as const;

export const metadataDefaults = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  keywords: siteConfig.keywords,
} as const;
