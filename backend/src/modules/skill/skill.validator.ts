import { z } from "zod";
import { EndorsementVote } from "@prisma/client";

export const addSkillSchema = z.object({
  name: z.string().min(1, "نام مهارت الزامی است.").max(60),
});

export const endorseSkillSchema = z.object({
  vote: z.nativeEnum(EndorsementVote),
  endorserName: z.string().max(100).optional(),
});

export const endorseByTagsSchema = z.object({
  tagNames: z.array(z.string().min(1).max(60)).min(1).max(20),
  endorserName: z.string().max(100).optional(),
});

export type AddSkillInput = z.infer<typeof addSkillSchema>;
export type EndorseSkillInput = z.infer<typeof endorseSkillSchema>;
export type EndorseByTagsInput = z.infer<typeof endorseByTagsSchema>;
