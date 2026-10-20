// Single source of truth for the pre-assessment's fixed questions.
// Copied verbatim (Persian text and order) from every sheet of
// "فرم ارزیابی اولیه برند شخصی دانشجو.xlsx" except sheet 1 (اطلاعات
// پایه — split between fields already on the profile, which are never
// re-asked, and the handful below that aren't) and sheet 5 (خلاصه و
// امتیاز کلی — fully derived, computed server-side in
// pre-assessment.service.ts, not collected here).

export const PROFESSIONAL_FIELD_OPTIONS = [
  "کسب‌وکار",
  "فناوری",
  "هنر",
  "آموزش",
  "پزشکی و سلامت",
  "مهندسی",
  "سایر",
] as const;

export const PROGRAM_GOAL_OPTIONS = [
  "آشنایی با مفاهیم برند شخصی",
  "آماده‌سازی برای جشنواره",
  "پیدا کردن مسیر شغلی",
  "توسعه شبکه حرفه‌ای",
  "یادگیری تولید محتوا",
  "سایر",
] as const;

// خودارزیابی
export const SELF_ASSESSMENT_AXES = [
  "تخصص و دانش فنی",
  "مهارت‌های نرم (ارتباطات، رهبری)",
  "شبکه حرفه‌ای",
  "پورتفولیو / نمونه‌کار",
  "حضور آنلاین",
  "شهرت در حوزه",
] as const;

// سوالات کیفی
export const QUALITATIVE_QUESTIONS = [
  "خودت را در یک جمله توصیف کن.",
  "چه چیزی تو را از بقیه متمایز می‌کند؟",
  "مخاطب هدف برند شخصی‌ات کیست؟",
  "در ۳ سال آینده کجا می‌خواهی باشی؟",
  "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟",
  "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)",
] as const;

// چک‌لیست حضور دیجیتال
export const DIGITAL_PLATFORMS = [
  "لینکدین",
  "اینستاگرام",
  "توییتر / ایکس",
  "یوتیوب",
  "سایت شخصی",
  "پادکست",
  "ریسرچ‌گیت",
  "گیت‌هاب",
] as const;

export type SelfAssessmentAxis = (typeof SELF_ASSESSMENT_AXES)[number];
export type QualitativeQuestion = (typeof QUALITATIVE_QUESTIONS)[number];
export type DigitalPlatform = (typeof DIGITAL_PLATFORMS)[number];

export interface SelfAssessmentEntry {
  axis: SelfAssessmentAxis;
  current: number; // 1-10
  target: number; // 1-10
}

export interface QualitativeEntry {
  question: QualitativeQuestion;
  answer: string;
}

export interface DigitalPresenceEntry {
  platform: DigitalPlatform;
  has: boolean;
  lastUpdate?: string | null;
  followers?: number | null;
  quality?: number | null; // 1-5, only meaningful when has === true
}
