import { z } from "zod";

export const taskInputSchema = z.object({
  title: z.string().min(1, "عنوان تکلیف الزامی است.").max(200),
  description: z.string().max(2000).optional(),
});

export const taskSubmissionSchema = z.object({
  content: z.string().min(1, "متن ارسال نمی‌تواند خالی باشد.").max(5000),
});

export type TaskInput = z.infer<typeof taskInputSchema>;
export type TaskSubmissionInput = z.infer<typeof taskSubmissionSchema>;
