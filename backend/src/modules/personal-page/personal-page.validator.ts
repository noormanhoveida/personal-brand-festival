import { z } from "zod";

export const updatePersonalPageSchema = z.object({
  tagline: z.string().max(200).optional(),
  identityWords: z.array(z.string().min(1)).max(4).optional(), // spec: "four defining keywords"
  strengthsJson: z.any().optional(), // structured cards — shape owned by the frontend
  valuesJson: z.any().optional(),
  introText: z.string().max(2000).optional(), // "30-second introduction"
  introMediaUrl: z.string().url().optional(),
  roadmapText: z.string().max(2000).optional(),
});

export type UpdatePersonalPageInput = z.infer<typeof updatePersonalPageSchema>;
