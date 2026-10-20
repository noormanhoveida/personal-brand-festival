import { z } from "zod";

export const ArtifactMediaTypeEnum = z.enum(["VIDEO", "AUDIO", "LINK", "DOCUMENT", "IMAGE"]);

export const artifactCreateSchema = z.object({
  axis: z.string().min(1, "محور الزامی است"),
  templateTitle: z.string().min(1, "عنوان قالب الزامی است"),
  title: z.string().min(2, "عنوان اثر باید حداقل ۲ حرف باشد"),
  description: z.string().optional().nullable(),
  mediaType: ArtifactMediaTypeEnum.default("LINK"),
  mediaUrl: z.string().min(1, "آدرس رسانه الزامی است"),
  coverImageUrl: z.string().optional().nullable(),
});

export const createArtifactSchema = artifactCreateSchema;
export type ArtifactInput = z.infer<typeof artifactCreateSchema>;

export const artifactRateSchema = z.object({
  score: z.number().min(1).max(5),
});
export const rateArtifactSchema = artifactRateSchema;

export const artifactCommentSchema = z.object({
  content: z.string().min(1, "متن نظر الزامی است"),
});
export const commentArtifactSchema = artifactCommentSchema;

export const artifactAdminReviewSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  adminNote: z.string().optional().nullable(),
});
export const reviewArtifactSchema = artifactAdminReviewSchema;
