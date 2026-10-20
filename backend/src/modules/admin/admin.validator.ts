import { z } from "zod";
import { Role } from "@prisma/client";

export const updateUserRoleSchema = z.object({
  role: z.nativeEnum(Role),
});

export const createRegionSchema = z.object({
  name: z.string().min(1).max(100),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type CreateRegionInput = z.infer<typeof createRegionSchema>;
