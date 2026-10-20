import { apiClient } from "./client";

export interface PreAssessmentStatus {
  completed: boolean;
  prefill: {
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    educationLevel: string;
    fieldOfStudy: string;
  };
}

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

export const SELF_ASSESSMENT_AXES = [
  "تخصص و دانش فنی",
  "مهارت‌های نرم (ارتباطات، رهبری)",
  "شبکه حرفه‌ای",
  "پورتفولیو / نمونه‌کار",
  "حضور آنلاین",
  "شهرت در حوزه",
] as const;

export const QUALITATIVE_QUESTIONS = [
  "خودت را در یک جمله توصیف کن.",
  "چه چیزی تو را از بقیه متمایز می‌کند؟",
  "مخاطب هدف برند شخصی‌ات کیست؟",
  "در ۳ سال آینده کجا می‌خواهی باشی؟",
  "بزرگ‌ترین چالش تو در ساختن برند شخصی چیست؟",
  "آیا تاکنون محتوا تولید کرده‌ای؟ (بله/خیر + توضیح)",
] as const;

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

export interface SelfAssessmentEntry {
  axis: (typeof SELF_ASSESSMENT_AXES)[number];
  current: number;
  target: number;
}

export interface QualitativeEntry {
  question: (typeof QUALITATIVE_QUESTIONS)[number];
  answer: string;
}

export interface DigitalPresenceEntry {
  platform: (typeof DIGITAL_PLATFORMS)[number];
  has: boolean;
  lastUpdate?: string | null;
  followers?: number | null;
  quality?: number | null;
}

export interface PreAssessmentInput {
  university: string;
  linkedinUrl?: string | null;
  personalWebsiteUrl?: string | null;
  instagramHandle?: string | null;
  professionalField: (typeof PROFESSIONAL_FIELD_OPTIONS)[number];
  programGoal: (typeof PROGRAM_GOAL_OPTIONS)[number];
  goalDescription?: string | null;
  selfAssessment: SelfAssessmentEntry[];
  qualitativeAnswers: QualitativeEntry[];
  digitalPresence: DigitalPresenceEntry[];
}

export interface PreAssessmentRecord extends PreAssessmentInput {
  id: string;
  participantId: string;
  coordinatorNote: string | null;
  submittedAt: string;
}

export async function getPreAssessmentStatus() {
  const { data } = await apiClient.get<PreAssessmentStatus>("/pre-assessment/status");
  return data;
}

export async function submitPreAssessment(input: PreAssessmentInput) {
  const { data } = await apiClient.post<PreAssessmentRecord>("/pre-assessment", input);
  return data;
}

export async function getMyPreAssessment() {
  const { data } = await apiClient.get<PreAssessmentRecord | null>("/pre-assessment/mine");
  return data;
}

export interface PreAssessmentSummary {
  selfAssessment: (SelfAssessmentEntry & { gap: number })[];
  selfAssessmentAverage: { current: number; target: number; gap: number };
  digitalPresence: DigitalPresenceEntry[];
  digitalPresenceTotals: { activeCount: number; averageQuality: number };
  coordinatorNote: string | null;
}

export async function getPreAssessmentForParticipant(participantId: string) {
  const { data } = await apiClient.get<PreAssessmentRecord & { summary: PreAssessmentSummary }>(
    `/pre-assessment/${participantId}`
  );
  return data;
}

export async function setCoordinatorNote(participantId: string, coordinatorNote: string) {
  const { data } = await apiClient.patch<PreAssessmentRecord>(
    `/pre-assessment/${participantId}/coordinator-note`,
    { coordinatorNote }
  );
  return data;
}

export interface PreAssessmentListEntry {
  participantId: string;
  firstName: string;
  lastName: string;
  completed: boolean;
  submittedAt: string | null;
}

export async function listAllPreAssessments() {
  const { data } = await apiClient.get<{ participants: PreAssessmentListEntry[] }>("/pre-assessment");
  return data.participants;
}
