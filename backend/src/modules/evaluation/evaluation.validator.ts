import { z } from "zod";

export const criterionInputSchema = z.object({
  key: z.string().min(1).max(60),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  // Weight is a fraction of the total (e.g. 0.2 for 20%). The service
  // does not hard-reject a set of weights that doesn't sum to 1 —
  // Admin may be mid-edit across multiple requests — but computeFinalScore
  // always normalizes against the weights actually used.
  weight: z.number().min(0).max(1),
});

export const criterionUpdateSchema = criterionInputSchema.partial();

export const assignEvaluatorSchema = z.object({
  evaluatorUserId: z.string().uuid(),
  participantId: z.string().uuid(),
});

export const createEvaluationSchema = z.object({
  participantId: z.string().uuid(),
});

const scoreEntrySchema = z.object({
  criterionId: z.string().uuid(),
  score: z.number().min(0).max(100),
  comment: z.string().max(1000).optional(),
});

export const saveDraftSchema = z.object({
  scores: z.array(scoreEntrySchema).min(1),
  comment: z.string().max(2000).optional(),
  transformationScore: z.number().min(0).max(100).optional(),
});

export type CriterionInput = z.infer<typeof criterionInputSchema>;
export type CriterionUpdateInput = z.infer<typeof criterionUpdateSchema>;
export type AssignEvaluatorInput = z.infer<typeof assignEvaluatorSchema>;
export type CreateEvaluationInput = z.infer<typeof createEvaluationSchema>;
export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
