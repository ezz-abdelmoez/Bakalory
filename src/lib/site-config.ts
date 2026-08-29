export const siteConfig = {
  name: "برمجة 2 باك",
  shortName: "برمجة 2 باك",
  description:
    "منصة عربية مجانية لطلاب السنة الثانية باكالوريا — مسار الهندسة والحاسب: دروس مبسطة في تكنولوجيا المعلومات، ملفات قابلة للتحميل، واختبارات تفاعلية.",
  url: "https://programming2bac.example.com",
  locale: "ar_MA",
  keywords: [
    "الهندسة والحاسب",
    "باكالوريا",
    "2 باك",
    "تكنولوجيا المعلومات",
    "التحول الاجتماعي",
    "الحوسبة السحابية",
    "الحوسبة الكمومية",
    "قانون مور",
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
