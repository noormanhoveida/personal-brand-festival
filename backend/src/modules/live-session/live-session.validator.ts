import { z } from "zod";

export const groupingInputSchema = z.object({
  taskBrief: z.string().optional(),
  groups: z
    .array(
      z.object({
        name: z.string().min(1, "نام گروه الزامی است."),
        participantIds: z.array(z.string().uuid()).min(1, "هر گروه باید حداقل یک عضو داشته باشد."),
      })
    )
    .min(1, "حداقل یک گروه لازم است."),
});

export const logFilterSchema = z.object({
  groupId: z.string().uuid().optional(),
  participantId: z.string().uuid().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});
