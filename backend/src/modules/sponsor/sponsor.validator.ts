import { z } from "zod";

export const SponsorPlacementEnum = z.enum(["DASHBOARD", "LANDING_HERO", "LANDING_VERTICAL"]);
export const SponsorSlideTypeEnum = z.enum(["IMAGE", "YOUTUBE"]);

export const createSponsorSchema = z.object({
  name: z.string().min(2, "نام اسپانسر حداقل ۲ کاراکتر است"),
  slug: z
    .string()
    .min(2, "اسلاگ حداقل ۲ کاراکتر است")
    .regex(/^[a-z0-9-]+$/, "اسلاگ فقط حروف کوچک انگلیسی، عدد و خط تیره مجاز است"),
  tagline: z.string().max(160).optional().nullable(),
  placement: SponsorPlacementEnum.default("DASHBOARD"),
  slideType: SponsorSlideTypeEnum.default("IMAGE"),
  slideMediaUrl: z.string().url("آدرس تصویر یا ویدیوی اسلاید نامعتبر است"),
  order: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),

  // دکمه اقدام خارجی اختیاری
  externalLinkLabel: z.string().max(60).optional().nullable(),
  externalLinkUrl: z.string().url("آدرس لینک خارجی نامعتبر است").optional().nullable(),

  // محتوای صفحه اختصاصی
  coverImageUrl: z.string().url("آدرس تصویر کاور نامعتبر است").optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  websiteUrl: z.string().url("آدرس وب‌سایت نامعتبر است").optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  linkedinUrl: z.string().optional().nullable(),
  telegramUrl: z.string().optional().nullable(),
});

export const updateSponsorSchema = createSponsorSchema.partial();
