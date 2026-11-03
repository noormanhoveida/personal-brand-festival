import { z } from "zod";
import { BusinessCategory, BusinessVideoStatus } from "@prisma/client";
import { normalizeWebsite, normalizeInstagram, normalizeTelegram } from "./business-showcase.links";

const websiteFieldSchema = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str) return null;
  return normalizeWebsite(str);
}, z.string().url("آدرس وب‌سایت نامعتبر است.").nullable().optional());

const instagramFieldSchema = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str) return null;
  return normalizeInstagram(str);
}, z.string().url().nullable().optional());

const telegramFieldSchema = z.preprocess((val) => {
  if (val === null || val === undefined) return null;
  const str = String(val).trim();
  if (!str) return null;
  return normalizeTelegram(str);
}, z.string().url().nullable().optional());

export const createBusinessVideoSchema = z.object({
  businessName: z.string().trim().min(2, "نام کسب‌وکار حداقل باید ۲ کاراکتر باشد.").max(100),
  ownerName: z.string().trim().min(2, "نام صاحب کسب‌وکار حداقل باید ۲ کاراکتر باشد.").max(100),
  category: z.nativeEnum(BusinessCategory).default(BusinessCategory.OTHER),
  videoUrl: z.string().min(1, "آدرس فایل ویدیو الزامی است."),
  thumbnailUrl: z.string().optional().nullable(),
  durationSeconds: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return 0;
    const num = Number(val);
    return isNaN(num) ? 0 : Math.round(num);
  }, z.number().int().min(0).max(60, "طول ویدیو نباید بیشتر از ۶۰ ثانیه باشد.").default(0)),
  fileSizeBytes: z.coerce.number().int().min(0).max(52428800, "حجم فایل نباید بیش از ۵۰ مگابایت باشد.").default(0),
  description: z.string().max(2000, "توضیحات نباید بیش از ۲۰۰۰ کاراکتر باشد.").optional().nullable(),
  websiteUrl: websiteFieldSchema,
  instagramUrl: instagramFieldSchema,
  telegramUrl: telegramFieldSchema,
  phoneNumber: z.string().max(20).optional().nullable(),
});

export const addCommentSchema = z.object({
  content: z.string().trim().min(2, "متن نظر حداقل باید ۲ کاراکتر باشد.").max(1000, "متن نظر نباید بیش از ۱۰۰۰ کاراکتر باشد."),
  parentId: z.string().uuid("شناسه والد نامعتبر است.").optional().nullable(),
});

export const adminReviewSchema = z.object({
  status: z.nativeEnum(BusinessVideoStatus),
  rejectionReason: z.string().max(500).optional().nullable(),
  isFeatured: z.boolean().optional(),
  order: z.coerce.number().int().optional(),
});
