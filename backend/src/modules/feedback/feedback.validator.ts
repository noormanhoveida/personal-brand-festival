import { z } from "zod";
import { FeedbackVisibility } from "@prisma/client";

export const createFeedbackRequestSchema = z.object({
  expiresInDays: z.number().int().positive().max(365).optional(),
});

// The six fixed "آینه من" questions from the spec — answers are keyed
// by id so the frontend form and this schema stay in lockstep.
export const feedbackAnswersSchema = z.object({
  q1: z.string().min(1, "پاسخ الزامی است.").max(500), // چهار کلمه توصیفی
  q2: z.string().min(1, "پاسخ الزامی است.").max(500), // بزرگ‌ترین نقطه قوت
  q3: z.string().min(1, "پاسخ الزامی است.").max(500), // تمایز از دیگران
  q4: z.string().min(1, "پاسخ الزامی است.").max(500), // معرفی به شخص دیگر
  q5: z.string().min(1, "پاسخ الزامی است.").max(500), // زمینه موفقیت
  q6: z.string().min(1, "پاسخ الزامی است.").max(500), // هویت حرفه‌ای مرتبط
});

export const submitFeedbackSchema = z.object({
  linkToken: z.string().min(1),
  authorName: z.string().max(100).optional(),
  answers: feedbackAnswersSchema,
  visibility: z.nativeEnum(FeedbackVisibility).optional(),
  anonymous: z.boolean().optional(), // convenience flag; see service for how it maps
});

// Same shape minus linkToken — the participant is identified by slug
// in the URL instead (see /feedback/by-slug/:slug).
export const submitFeedbackBySlugSchema = submitFeedbackSchema.omit({ linkToken: true });

export type CreateFeedbackRequestInput = z.infer<
  typeof createFeedbackRequestSchema
>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
