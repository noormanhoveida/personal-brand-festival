import { z } from "zod";
import { normalizeDigits } from "../../utils/digits";

// Used for both initial onboarding and later profile edits — all fields
// optional on update, but the service enforces the required set on
// first creation (see profile.service.ts).
export const profileInputSchema = z.object({
  firstName: z.string().min(1, "نام الزامی است.").max(60),
  lastName: z.string().min(1, "نام خانوادگی الزامی است.").max(60),
  mobile: z
    .string()
    .transform((val) => normalizeDigits(val.trim()))
    .refine((val) => /^09\d{9}$/.test(val), {
      message: "شماره موبایل باید با فرمت ۰۹xxxxxxxxx باشد.",
    }),

  // NEW: regionId is the real source of truth
  regionId: z.string().uuid("منطقه نامعتبر است."),

  city: z.string().min(1, "شهر الزامی است."),
  educationLevel: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  professionalField: z.string().optional(),
  occupation: z.string().optional(),
  bio: z.string().max(1000).optional(),
  interests: z.array(z.string().min(1)).max(20).optional(),
});

export const profileUpdateSchema = profileInputSchema.partial();

export type ProfileInput = z.infer<typeof profileInputSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
