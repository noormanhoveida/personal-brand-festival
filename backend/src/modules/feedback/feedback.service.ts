import crypto from "crypto";
import { FeedbackVisibility } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { CreateFeedbackRequestInput, SubmitFeedbackInput } from "./feedback.validator";

export class FeedbackError extends AppError {}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new FeedbackError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

function generateLinkToken() {
  return crypto.randomBytes(24).toString("hex");
}

/**
 * Creates a shareable "آینه من" feedback link. The token is opaque and
 * unguessable (192 bits) since it is effectively a bearer credential —
 * anyone holding the link can submit feedback without an account.
 */
export async function createFeedbackRequest(
  userId: string,
  input: CreateFeedbackRequestInput
) {
  const requesterId = await getParticipantIdForUser(userId);

  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  return prisma.feedbackRequest.create({
    data: {
      requesterId,
      linkToken: generateLinkToken(),
      expiresAt,
    },
  });
}

export async function listOwnFeedbackRequests(userId: string) {
  const requesterId = await getParticipantIdForUser(userId);

  return prisma.feedbackRequest.findMany({
    where: { requesterId },
    include: { responses: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * All feedback ever received by the participant, across every request
 * link they've generated — this is what "آینه من" shows them. Owners
 * always see the full content regardless of the visibility field;
 * visibility only governs what OTHER audiences (public page visitors,
 * evaluators) may see, enforced at those read sites, not here.
 */
export async function listReceivedFeedback(userId: string) {
  const requesterId = await getParticipantIdForUser(userId);

  return prisma.feedbackResponse.findMany({
    where: { request: { requesterId } },
    include: { request: true },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Public endpoint (no auth required) — friends, colleagues, mentors,
 * and managers rarely have accounts on the platform. If the submitter
 * IS a logged-in participant, we still link their profile so
 * "participant-authored" feedback can be distinguished later.
 */
export async function submitFeedback(
  input: SubmitFeedbackInput,
  authorUserId?: string
) {
  const request = await prisma.feedbackRequest.findUnique({
    where: { linkToken: input.linkToken },
  });

  if (!request) {
    throw new FeedbackError("این لینک بازخورد معتبر نیست.", 404);
  }
  if (request.expiresAt && request.expiresAt < new Date()) {
    throw new FeedbackError("مهلت این لینک بازخورد به پایان رسیده است.", 410);
  }

  let authorParticipantId: string | undefined;
  if (authorUserId) {
    const profile = await prisma.participantProfile.findUnique({
      where: { userId: authorUserId },
      select: { id: true },
    });
    authorParticipantId = profile?.id;
  }

  const visibility =
    input.visibility ??
    (input.anonymous ? FeedbackVisibility.ANONYMOUS : FeedbackVisibility.PRIVATE);

  return prisma.feedbackResponse.create({
    data: {
      requestId: request.id,
      authorParticipantId,
      authorName: visibility === FeedbackVisibility.ANONYMOUS ? undefined : input.authorName,
      answers: input.answers,
      visibility,
    },
  });
}

/**
 * Every participant effectively has one standing, non-expiring
 * "open" feedback channel in addition to any one-off shareable links
 * they generate themselves. This lets visitors leave feedback directly
 * from a public profile page — some participants never send their
 * link to everyone who might want to weigh in, so gating feedback
 * behind a manually-shared link would silently exclude them.
 */
async function findOrCreateDefaultRequest(participantId: string) {
  const existing = await prisma.feedbackRequest.findFirst({
    where: { requesterId: participantId, expiresAt: null },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;

  return prisma.feedbackRequest.create({
    data: { requesterId: participantId, linkToken: generateLinkToken() },
  });
}

/**
 * Public — no auth. Submits feedback directly against a participant's
 * open channel, identified by their public slug rather than a private
 * link token. This is the mechanism behind the public-profile feedback
 * form; visitors never see or need a token.
 */
export async function submitFeedbackBySlug(
  slug: string,
  input: Omit<SubmitFeedbackInput, "linkToken">,
  authorUserId?: string
) {
  const participant = await prisma.participantProfile.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!participant) {
    throw new FeedbackError("این شرکت‌کننده یافت نشد.", 404);
  }

  const request = await findOrCreateDefaultRequest(participant.id);

  let authorParticipantId: string | undefined;
  if (authorUserId) {
    const profile = await prisma.participantProfile.findUnique({
      where: { userId: authorUserId },
      select: { id: true },
    });
    authorParticipantId = profile?.id;
  }

  const visibility =
    input.visibility ??
    (input.anonymous ? FeedbackVisibility.ANONYMOUS : FeedbackVisibility.PRIVATE);

  return prisma.feedbackResponse.create({
    data: {
      requestId: request.id,
      authorParticipantId,
      authorName: visibility === FeedbackVisibility.ANONYMOUS ? undefined : input.authorName,
      answers: input.answers,
      visibility,
    },
  });
}

/**
 * Resolves a feedback link token to who it belongs to — used so the
 * public feedback form can greet the visitor with an actual name
 * instead of generic text, and so tag endorsements (which are
 * slug-based) can be applied from a link-based submission too.
 */
export async function getRequestInfo(linkToken: string) {
  const request = await prisma.feedbackRequest.findUnique({
    where: { linkToken },
    include: { requester: { select: { firstName: true, lastName: true, slug: true } } },
  });
  if (!request) {
    throw new FeedbackError("این لینک بازخورد معتبر نیست.", 404);
  }
  if (request.expiresAt && request.expiresAt < new Date()) {
    throw new FeedbackError("مهلت این لینک بازخورد به پایان رسیده است.", 410);
  }
  return request.requester;
}
