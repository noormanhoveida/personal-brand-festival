import { z } from "zod";
import { BootcampStatus, QuestionInputType, ResponseStage } from "@prisma/client";

const isoDate = z.coerce.date();

export const bootcampInputSchema = z.object({
  title: z.string().min(1, "عنوان بوت‌کمپ الزامی است."),
  description: z.string().optional(),
  instructor: z.string().optional(),
  coverImageUrl: z.string().url().optional(),
  teaserVideoUrl: z.string().url().optional(),
  date: isoDate,
  startTime: isoDate,
  endTime: isoDate,
  deadline: isoDate.optional(),
  journeySectionId: z.string().uuid().optional(),
});

export const bootcampUpdateSchema = bootcampInputSchema.partial();

export const bootcampStatusSchema = z.object({
  status: z.nativeEnum(BootcampStatus),
});

export const questionInputSchema = z
  .object({
    text: z.string().min(1, "متن سؤال الزامی است."),
    stage: z.nativeEnum(ResponseStage),
    inputType: z.nativeEnum(QuestionInputType).default("TEXT"),
    situationId: z.string().uuid().optional(),
    options: z.array(z.string().min(1)).optional(),
    order: z.number().int().nonnegative().optional(),
  })
  .refine(
    (data) =>
      (data.inputType !== "SINGLE_CHOICE" && data.inputType !== "MULTI_CHOICE") ||
      (data.options && data.options.length >= 2),
    { message: "سؤالات چندگزینه‌ای باید حداقل دو گزینه داشته باشند.", path: ["options"] }
  );

export type BootcampInput = z.infer<typeof bootcampInputSchema>;
export type BootcampUpdateInput = z.infer<typeof bootcampUpdateSchema>;
export type QuestionInput = z.infer<typeof questionInputSchema>;
