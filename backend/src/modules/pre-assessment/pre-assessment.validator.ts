import { z } from "zod";
import {
  DIGITAL_PLATFORMS,
  PROFESSIONAL_FIELD_OPTIONS,
  PROGRAM_GOAL_OPTIONS,
  QUALITATIVE_QUESTIONS,
  SELF_ASSESSMENT_AXES,
} from "./pre-assessment.constants";

const selfAssessmentSchema = z
  .array(
    z.object({
      axis: z.enum(SELF_ASSESSMENT_AXES),
      current: z.number().int().min(1).max(10),
      target: z.number().int().min(1).max(10),
    })
  )
  .length(SELF_ASSESSMENT_AXES.length, "همه‌ی محورهای خودارزیابی باید تکمیل شوند.")
  .refine(
    (rows) => new Set(rows.map((r) => r.axis)).size === SELF_ASSESSMENT_AXES.length,
    "هر محور خودارزیابی باید دقیقاً یک‌بار پاسخ داده شود."
  );

const qualitativeSchema = z
  .array(
    z.object({
      question: z.enum(QUALITATIVE_QUESTIONS),
      answer: z.string().min(1, "پاسخ نمی‌تواند خالی باشد."),
    })
  )
  .length(QUALITATIVE_QUESTIONS.length, "به همه‌ی سؤالات کیفی باید پاسخ داده شود.")
  .refine(
    (rows) => new Set(rows.map((r) => r.question)).size === QUALITATIVE_QUESTIONS.length,
    "هر سؤال کیفی باید دقیقاً یک‌بار پاسخ داده شود."
  );

const digitalPresenceSchema = z
  .array(
    z.object({
      platform: z.enum(DIGITAL_PLATFORMS),
      has: z.boolean(),
      lastUpdate: z.string().optional().nullable(),
      followers: z.number().int().min(0).optional().nullable(),
      quality: z.number().int().min(1).max(5).optional().nullable(),
    })
  )
  .length(DIGITAL_PLATFORMS.length, "وضعیت همه‌ی پلتفرم‌ها باید مشخص شود.")
  .refine(
    (rows) => new Set(rows.map((r) => r.platform)).size === DIGITAL_PLATFORMS.length,
    "هر پلتفرم باید دقیقاً یک‌بار ذکر شود."
  );

export const preAssessmentInputSchema = z.object({
  university: z.string().min(1, "دانشگاه الزامی است."),
  linkedinUrl: z.string().optional().nullable(),
  personalWebsiteUrl: z.string().optional().nullable(),
  instagramHandle: z.string().optional().nullable(),
  professionalField: z.enum(PROFESSIONAL_FIELD_OPTIONS),
  programGoal: z.enum(PROGRAM_GOAL_OPTIONS),
  goalDescription: z.string().optional().nullable(),
  selfAssessment: selfAssessmentSchema,
  qualitativeAnswers: qualitativeSchema,
  digitalPresence: digitalPresenceSchema,
});

export const coordinatorNoteSchema = z.object({
  coordinatorNote: z.string(),
});

export type PreAssessmentInput = z.infer<typeof preAssessmentInputSchema>;
