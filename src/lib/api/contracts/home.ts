export interface HomeFeatureDto {
  title: string;
  description: string;
  icon: string;
}

export interface HomeContentDto {
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  benefits: string[];
  features: HomeFeatureDto[];
}
