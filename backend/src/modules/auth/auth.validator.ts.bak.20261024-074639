import { z } from "zod";

// تبدیل اعداد فارسی و عربی به انگلیسی و حذف فاصله
export function normalizeDigits(str: string): string {
  if (!str) return str;
  return str
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[\s\-\(\)]/g, "")
    .trim();
}

// نرمال‌سازی شماره موبایل ایران به فرمت 09xxxxxxxxx
export function normalizeIranPhone(phone: string): string {
  let p = normalizeDigits(phone);
  if (p.startsWith("+98")) p = "0" + p.slice(3);
  else if (p.startsWith("98")) p = "0" + p.slice(2);
  else if (p.startsWith("0098")) p = "0" + p.slice(4);
  return p;
}

export const registerSchema = z.object({
  body: z
    .object({
      email: z
        .string()
        .trim()
        .toLowerCase()
        .email("فرمت ایمیل نامعتبر است")
        .optional()
        .or(z.literal("")),
      phone: z
        .string()
        .optional()
        .transform((val) => (val ? normalizeIranPhone(val) : undefined))
        .refine(
          (val) => !val || /^09\d{9}$/.test(val),
          "شماره موبایل باید ۱۱ رقم و با 09 شروع شود"
        ),
      password: z
        .string()
        .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد"),
    })
    .refine((data) => data.email || data.phone, {
      message: "وارد کردن ایمیل یا شماره موبایل الزامی است",
      path: ["phone"],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(1, "ایمیل یا شماره موبایل الزامی است")
      .transform((val) => {
        const cleaned = normalizeDigits(val);
        if (/^(\+98|0098|98|0)?9\d{9}$/.test(cleaned)) {
          return normalizeIranPhone(cleaned);
        }
        return val.trim().toLowerCase();
      }),
    password: z.string().min(1, "رمز عبور الزامی است"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
    code: z
      .string()
      .transform(normalizeDigits)
      .refine((c) => /^\d{6}$/.test(c), "کد تأیید باید ۶ رقم باشد"),
  }),
});

export const verifyPhoneSchema = z.object({
  body: z.object({
    phone: z.string().transform(normalizeIranPhone),
    code: z
      .string()
      .transform(normalizeDigits)
      .refine((c) => /^\d{6}$/.test(c), "کد تأیید باید ۶ رقم باشد"),
  }),
});

export const resendVerificationSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email(),
  }),
});

export const resendPhoneVerificationSchema = z.object({
  body: z.object({
    phone: z.string().transform(normalizeIranPhone),
  }),
});

export const requestPasswordResetSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست."),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("ایمیل معتبر نیست."),
  code: z.string().min(4, "کد بازیابی نامعتبر است.").max(10),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد."),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "رمز عبور فعلی الزامی است."),
  newPassword: z.string().min(8, "رمز عبور جدید باید حداقل ۸ کاراکتر باشد."),
});
