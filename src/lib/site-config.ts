export const siteConfig = {
  name: "البرمجة والذكاء الاصطناعي",
  shortName: "برمجة وذكاء اصطناعي",
  description:
    "منصة عربية مجانية لطلاب الصف الثاني بكالوريا — مسار الهندسة والحاسب، تقدم دروسًا منظمة في الذكاء الاصطناعي والأمن السيبراني وتطبيقات وتصميم الويب، مع ملفات قابلة للتحميل واختبارات تفاعلية.",
  url: "https://programming2bac.example.com",
  locale: "ar_MA",
  keywords: [
    "البرمجة والذكاء الاصطناعي",
    "الهندسة والحاسب",
    "باكالوريا",
    "2 باك",
    "الذكاء الاصطناعي",
    "الأمن السيبراني",
    "تطبيقات الويب",
    "تصميم الويب والوسائط",
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
