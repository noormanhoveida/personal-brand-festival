import { z } from "zod";

export const createBoardSchema = z.object({
  title: z.string().min(1, "عنوان تابلو الزامی است."),
  description: z.string().optional(),
});

export const setEntryScoreSchema = z.object({
  participantId: z.string().uuid(),
  score: z.number(),
  note: z.string().optional(),
});

export const setPublishedSchema = z.object({
  published: z.boolean(),
});
