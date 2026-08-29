import { z } from "zod";

export const homeFeatureSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  icon: z.string().min(1),
});

export const homeContentSchema = z.object({
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  primaryCta: z.string().min(1),
  secondaryCta: z.string().min(1),
  benefits: z.array(z.string().min(1)),
  features: z.array(homeFeatureSchema),
});
