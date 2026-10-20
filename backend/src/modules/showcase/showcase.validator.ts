import { z } from "zod";

export const setFeaturedSchema = z.object({ featured: z.boolean() });
export const setFinalistSchema = z.object({ finalist: z.boolean() });

// null clears the winner category (e.g. after a correction).
export const setWinnerSchema = z.object({
  winnerCategory: z.string().min(1).max(120).nullable(),
});

export type SetFeaturedInput = z.infer<typeof setFeaturedSchema>;
export type SetFinalistInput = z.infer<typeof setFinalistSchema>;
export type SetWinnerInput = z.infer<typeof setWinnerSchema>;
