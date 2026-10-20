import fs from "fs";
import path from "path";
import { prisma } from "../../config/db";
import { env } from "../../config/env";
import { uploadDirAbsolutePath } from "../../config/upload";
import { AppError } from "../../utils/errors";
import { UploadMediaInput } from "./media.validator";

export class MediaError extends AppError {}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new MediaError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

function publicUrlFor(filename: string) {
  return `${env.backendUrl}/uploads/${filename}`;
}

export async function saveUploadedMedia(
  userId: string,
  file: Express.Multer.File,
  input: UploadMediaInput
) {
  const participantId = await getParticipantIdForUser(userId);

  return prisma.media.create({
    data: {
      participantId,
      type: input.type,
      url: publicUrlFor(file.filename),
      mimeType: file.mimetype,
      sizeBytes: file.size,
      order: input.order ?? 0,
    },
  });
}

export async function listOwnMedia(userId: string) {
  const participantId = await getParticipantIdForUser(userId);
  return prisma.media.findMany({
    where: { participantId },
    orderBy: { order: "asc" },
  });
}

export async function deleteMedia(userId: string, mediaId: string) {
  const participantId = await getParticipantIdForUser(userId);

  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media || media.participantId !== participantId) {
    throw new MediaError("تصویر یافت نشد.", 404);
  }

  await prisma.media.delete({ where: { id: mediaId } });

  // Best-effort local file cleanup — never fail the request over it,
  // since the DB record (the source of truth for the API) is already gone.
  const filename = media.url.split("/").pop();
  if (filename) {
    const filePath = path.join(uploadDirAbsolutePath, filename);
    fs.unlink(filePath, () => undefined);
  }
}
