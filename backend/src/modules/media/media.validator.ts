import { z } from "zod";
import { MediaType } from "@prisma/client";

export const uploadMediaSchema = z.object({
  type: z.nativeEnum(MediaType),
  order: z.coerce.number().int().nonnegative().optional(),
});

export type UploadMediaInput = z.infer<typeof uploadMediaSchema>;
