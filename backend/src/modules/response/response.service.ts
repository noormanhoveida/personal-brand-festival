import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { AddVersionInput, CreateResponseInput } from "./response.validator";

export class ResponseError extends AppError {}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new ResponseError(
      "ابتدا باید پروفایل خود را تکمیل کنید.",
      404
    );
  }
  return profile.id;
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

/**
 * Three auto-scored question shapes exist:
 *
 * 1. TRAIT_TAG — the participant picks a trait NAME from the pool for
 *    a situation; score = that trait's weight in that situation.
 *
 * 2. SINGLE_CHOICE imported directly from the "SituationalQuestions"
 *    Excel sheet (question.correctOption is set) — an explicitly
 *    authored MCQ with its own right answer and per-outcome weights.
 *    content is the option TEXT the participant picked; it's compared
 *    against question.options[correctOption's letter index]. Score is
 *    weightCorrect on a match, weightIncorrect otherwise.
 *
 * 3. SINGLE_CHOICE with a traitId set but no correctOption — one of
 *    the auto-generated per-trait situational questions (spec: 500
 *    traits × 4 situations = 2000 questions). The options are that
 *    trait's phrasings across every situation it has one for; content
 *    is the phrasing TEXT picked. Score is the phrasing's native
 *    weight if it matches the question's own situation, or its
 *    mismatchWeight if the picked phrasing actually belongs to a
 *    *different* situation — this is what makes "خلاقیت" phrased for
 *    a job interview score lower when picked on the "meeting someone
 *    new" question, and vice versa.
 *
 * Returns null for any other question type, or if no matching
 * trait/weight is found (the answer is still saved, just unscored).
 */
async function computeAutoScore(
  questionId: string,
  content: string
): Promise<number | null> {
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) return null;

  if (question.inputType === "TRAIT_TAG" && question.situationId) {
    const trait = await prisma.trait.findUnique({ where: { name: content } });
    if (!trait) return null;

    const traitWeight = await prisma.traitWeight.findUnique({
      where: { traitId_situationId: { traitId: trait.id, situationId: question.situationId } },
    });
    return traitWeight?.weight ?? null;
  }

  if (question.inputType === "SINGLE_CHOICE" && question.correctOption) {
    const correctIndex = OPTION_LETTERS.indexOf(
      question.correctOption as (typeof OPTION_LETTERS)[number]
    );
    const correctText = correctIndex >= 0 ? question.options[correctIndex] : undefined;
    const isCorrect = correctText !== undefined && content.trim() === correctText.trim();
    return isCorrect ? question.weightCorrect ?? 0 : question.weightIncorrect ?? 0;
  }

  if (question.inputType === "SINGLE_CHOICE" && question.traitId && question.situationId) {
    const matchedExpression = await prisma.traitWeight.findFirst({
      where: { traitId: question.traitId, text: content },
    });
    if (!matchedExpression) return null;

    return matchedExpression.situationId === question.situationId
      ? matchedExpression.weight
      : matchedExpression.mismatchWeight;
  }

  return null;
}

/**
 * Every response the participant has ever given, each with its full
 * version history — this is the data the before/after comparison UI
 * and the evaluator's response-history view are both built from.
 */
export async function listOwnResponses(userId: string) {
  const participantId = await getParticipantIdForUser(userId);

  return prisma.response.findMany({
    where: { participantId },
    include: {
      question: true,
      versions: { orderBy: { versionNumber: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getResponseHistory(userId: string, responseId: string) {
  const participantId = await getParticipantIdForUser(userId);

  const response = await prisma.response.findUnique({
    where: { id: responseId },
    include: {
      question: true,
      versions: { orderBy: { versionNumber: "asc" } },
    },
  });

  if (!response || response.participantId !== participantId) {
    throw new ResponseError("پاسخ یافت نشد.", 404);
  }

  return response;
}

/**
 * First answer to a given question. Creates the Response envelope plus
 * its version 1. If a Response already exists for this question, the
 * caller should use addResponseVersion instead — we refuse here rather
 * than silently branching, so the API contract stays explicit.
 */
export async function createResponse(userId: string, input: CreateResponseInput) {
  const participantId = await getParticipantIdForUser(userId);

  const question = await prisma.question.findUnique({
    where: { id: input.questionId },
  });
  if (!question) {
    throw new ResponseError("سؤال یافت نشد.", 404);
  }

  const existing = await prisma.response.findFirst({
    where: { participantId, questionId: input.questionId },
  });
  if (existing) {
    throw new ResponseError(
      "برای این سؤال قبلاً پاسخی ثبت شده است. برای ثبت نسخه جدید از مسیر ویرایش استفاده کنید.",
      409
    );
  }

  const autoScore = await computeAutoScore(input.questionId, input.content);

  return prisma.response.create({
    data: {
      participantId,
      questionId: input.questionId,
      versions: {
        create: {
          versionNumber: 1,
          content: input.content,
          stage: input.stage,
          bootcampId: input.bootcampId,
          createdBy: userId,
          autoScore,
        },
      },
    },
    include: { versions: true },
  });
}

/**
 * Appends a new version to an existing response. The prior version(s)
 * are never touched — this is the mechanism that preserves the
 * participant's "before" answer forever, even as they revise it after
 * a bootcamp or during a later reflection pass.
 */
export async function addResponseVersion(
  userId: string,
  responseId: string,
  input: AddVersionInput
) {
  const participantId = await getParticipantIdForUser(userId);

  const response = await prisma.response.findUnique({
    where: { id: responseId },
    include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
  });

  if (!response || response.participantId !== participantId) {
    throw new ResponseError("پاسخ یافت نشد.", 404);
  }

  const nextVersionNumber = (response.versions[0]?.versionNumber ?? 0) + 1;
  const autoScore = await computeAutoScore(response.questionId, input.content);

  return prisma.responseVersion.create({
    data: {
      responseId,
      versionNumber: nextVersionNumber,
      content: input.content,
      stage: input.stage,
      bootcampId: input.bootcampId,
      createdBy: userId,
      autoScore,
    },
  });
}


export async function listParticipantResponsesForAdmin(participantId: string) {
  return prisma.response.findMany({
    where: { participantId },
    include: {
      question: true,
      versions: { orderBy: { versionNumber: "asc" } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function setSelfTransformationScore(userId: string, responseId: string, score: number) {
  const participantId = await getParticipantIdForUser(userId);
  const response = await prisma.response.findUnique({ where: { id: responseId } });
  if (!response || response.participantId !== participantId) {
    throw new ResponseError("پاسخ یافت نشد.", 404);
  }
  return prisma.response.update({
    where: { id: responseId },
    data: {} as any,
  });
}

export async function setReviewerScore(responseId: string, score: number, feedback?: string) {
  return prisma.response.update({
    where: { id: responseId },
    data: {} as any,
  });
}
