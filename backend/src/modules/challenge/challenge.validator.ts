import { z } from "zod";

export const createChallengeSchema = z.object({
  title: z.string().min(1, "عنوان چالش الزامی است."),
  description: z.string().min(1, "توضیح چالش الزامی است."),
  instructorName: z.string().optional(),
  instructorEmail: z.string().email().optional().or(z.literal("")),
  opensAt: z.string().optional(),
  deadline: z.string().optional(),
});

export const updateChallengeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  instructorName: z.string().optional(),
  instructorEmail: z.string().email().optional().or(z.literal("")),
  opensAt: z.string().optional(),
  deadline: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const submitWorkSchema = z.object({
  textContent: z.string().optional(),
  photoUrl: z.string().optional(),
  documentUrl: z.string().optional(),
  linkUrl: z.string().optional(),
});
