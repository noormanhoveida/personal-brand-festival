import { ResponseStage, Visibility, FeedbackVisibility } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { UpdatePersonalPageInput } from "./personal-page.validator";
import { listPublicSkills } from "../skill/skill.service";

export class PersonalPageError extends AppError {}

/**
 * Every published, publicly-visible participant — the roster behind
 * the community/directory page where visitors browse by photo and
 * name before opening someone's full profile to leave feedback.
 */
export async function listPublicDirectory() {
  const participants = await prisma.participantProfile.findMany({
    where: {
      pageVisibility: Visibility.PUBLIC,
      personalPage: { publishedAt: { not: null } },
    },
    select: {
      firstName: true,
      lastName: true,
      slug: true,
      city: true,
      professionalField: true,
      media: { take: 1, orderBy: { order: "asc" } },
      personalPage: { select: { tagline: true } },
    },
    orderBy: { firstName: "asc" },
  });

  return participants.map((p) => ({
    fullName: `${p.firstName} ${p.lastName}`,
    slug: p.slug,
    city: p.city,
    professionalField: p.professionalField,
    tagline: p.personalPage?.tagline ?? null,
    photoUrl: p.media[0]?.url ?? null,
  }));
}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new PersonalPageError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

export async function getOwnPersonalPage(userId: string) {
  const participantId = await getParticipantIdForUser(userId);
  return prisma.personalPage.findUnique({ where: { participantId } });
}

/** Create-or-update — a participant edits the same page repeatedly. */
export async function upsertPersonalPage(
  userId: string,
  input: UpdatePersonalPageInput
) {
  const participantId = await getParticipantIdForUser(userId);

  return prisma.personalPage.upsert({
    where: { participantId },
    update: input,
    create: { participantId, ...input },
  });
}

export async function publishPage(userId: string) {
  const participantId = await getParticipantIdForUser(userId);

  const page = await prisma.personalPage.findUnique({ where: { participantId } });
  if (!page) {
    throw new PersonalPageError(
      "قبل از انتشار باید محتوای صفحه عمومی را تکمیل کنید.",
      400
    );
  }

  await prisma.$transaction([
    prisma.personalPage.update({
      where: { participantId },
      data: { publishedAt: new Date() },
    }),
    prisma.participantProfile.update({
      where: { id: participantId },
      data: { pageVisibility: Visibility.PUBLIC },
    }),
  ]);

  return getOwnPersonalPage(userId);
}

export async function unpublishPage(userId: string) {
  const participantId = await getParticipantIdForUser(userId);

  const existingPage = await prisma.personalPage.findUnique({ where: { participantId } });

  await prisma.$transaction([
    prisma.participantProfile.update({
      where: { id: participantId },
      data: { pageVisibility: Visibility.PRIVATE },
    }),
    ...(existingPage
      ? [
          prisma.personalPage.update({
            where: { participantId },
            data: { publishedAt: null },
          }),
        ]
      : []),
  ]);

  return getOwnPersonalPage(userId);
}

/**
 * Public read for /p/:slug. Returns 404 (not 403) for both "no such
 * slug" and "exists but not published" — the page's existence should
 * not be distinguishable from a typo, since a private participant's
 * privacy includes not confirming they're on the platform at all.
 */
export async function getPublicPageBySlug(slug: string) {
  const participant = await prisma.participantProfile.findUnique({
    where: { slug },
    include: {
      media: { orderBy: { order: "asc" } },
      personalPage: true,
    },
  });

  if (!participant || participant.pageVisibility !== Visibility.PUBLIC) {
    throw new PersonalPageError("این صفحه یافت نشد.", 404);
  }

  // Only the latest version of each PUBLIC response is shown — the
  // page is a snapshot of who they are now, not a version-control log.
  const publicResponses = await prisma.response.findMany({
    where: { participantId: participant.id, visibility: Visibility.PUBLIC },
    include: {
      question: true,
      versions: { orderBy: { versionNumber: "desc" }, take: 1 },
    },
  });

  const publicFeedback = await prisma.feedbackResponse.findMany({
    where: {
      request: { requesterId: participant.id },
      visibility: FeedbackVisibility.PUBLIC,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { authorName: true, answers: true, createdAt: true },
  });

  const skills = await listPublicSkills(participant.id);

  return {
    firstName: participant.firstName,
    lastName: participant.lastName,
    city: participant.city,
    province: participant.province,
    professionalField: participant.professionalField,
    occupation: participant.occupation,
    educationLevel: participant.educationLevel,
    fieldOfStudy: participant.fieldOfStudy,
    interests: participant.interests,
    bio: participant.bio,
    slug: participant.slug,
    media: participant.media,
    page: participant.personalPage,
    skills,
    highlightedResponses: publicResponses.map((r) => ({
      question: r.question.text,
      stage: r.versions[0]?.stage ?? ResponseStage.AFTER,
      content: r.versions[0]?.content ?? null,
    })),
    feedback: publicFeedback,
  };
}
