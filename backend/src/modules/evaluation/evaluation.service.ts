import { EvaluationStatus, Role } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import {
  AssignEvaluatorInput,
  CriterionInput,
  CriterionUpdateInput,
  SaveDraftInput,
} from "./evaluation.validator";

export class EvaluationError extends AppError {}

// ---------------------------------------------------------------------
// Criteria (Admin-configurable weights — spec §21)
// ---------------------------------------------------------------------

export async function listCriteria() {
  return prisma.evaluationCriterion.findMany({ orderBy: { title: "asc" } });
}

export async function createCriterion(input: CriterionInput) {
  const existing = await prisma.evaluationCriterion.findUnique({
    where: { key: input.key },
  });
  if (existing) {
    throw new EvaluationError("معیاری با این کلید قبلاً وجود دارد.", 409);
  }
  return prisma.evaluationCriterion.create({ data: input });
}

export async function updateCriterion(id: string, input: CriterionUpdateInput) {
  const existing = await prisma.evaluationCriterion.findUnique({ where: { id } });
  if (!existing) {
    throw new EvaluationError("معیار ارزیابی یافت نشد.", 404);
  }
  return prisma.evaluationCriterion.update({ where: { id }, data: input });
}

// ---------------------------------------------------------------------
// Evaluator assignment (spec §28 — "Assigned participants")
// ---------------------------------------------------------------------

export async function assignEvaluator(input: AssignEvaluatorInput) {
  const [evaluator, participant] = await Promise.all([
    prisma.user.findUnique({ where: { id: input.evaluatorUserId } }),
    prisma.participantProfile.findUnique({ where: { id: input.participantId } }),
  ]);

  if (!evaluator || evaluator.role !== Role.EVALUATOR) {
    throw new EvaluationError("کاربر ارزیاب معتبر نیست.", 400);
  }
  if (!participant) {
    throw new EvaluationError("شرکت‌کننده یافت نشد.", 404);
  }

  return prisma.evaluatorAssignment.upsert({
    where: {
      evaluatorUserId_participantId: {
        evaluatorUserId: input.evaluatorUserId,
        participantId: input.participantId,
      },
    },
    update: {},
    create: input,
  });
}

export async function listAssignedParticipants(evaluatorUserId: string) {
  return prisma.evaluatorAssignment.findMany({
    where: { evaluatorUserId },
    include: { participant: true },
    orderBy: { createdAt: "desc" },
  });
}

async function ensureAssigned(evaluatorUserId: string, participantId: string) {
  const assignment = await prisma.evaluatorAssignment.findUnique({
    where: {
      evaluatorUserId_participantId: { evaluatorUserId, participantId },
    },
  });
  if (!assignment) {
    throw new EvaluationError(
      "شما به این شرکت‌کننده به‌عنوان ارزیاب اختصاص داده نشده‌اید.",
      403
    );
  }
}

/**
 * The evaluator's single-page review bundle (spec §28): profile,
 * response history (for before/after comparison), received feedback,
 * and the evaluator's own draft/submitted evaluation, in one call
 * instead of four separate round-trips from the dashboard.
 */
export async function getParticipantReviewBundle(
  evaluatorUserId: string,
  participantId: string,
  isAdmin: boolean
) {
  if (!isAdmin) {
    await ensureAssigned(evaluatorUserId, participantId);
  }

  const participant = await prisma.participantProfile.findUnique({
    where: { id: participantId },
    include: { media: true, region: true },
  });
  if (!participant) {
    throw new EvaluationError("شرکت‌کننده یافت نشد.", 404);
  }

  const [responses, feedback, ownEvaluation, criteria] = await Promise.all([
    prisma.response.findMany({
      where: { participantId },
      include: { question: true, versions: { orderBy: { versionNumber: "asc" } } },
    }),
    prisma.feedbackResponse.findMany({
      where: { request: { requesterId: participantId } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.evaluation.findFirst({
      where: { participantId, evaluatorUserId },
      include: { scores: { include: { criterion: true } } },
    }),
    prisma.evaluationCriterion.findMany({ orderBy: { title: "asc" } }),
  ]);

  return { participant, responses, feedback, ownEvaluation, criteria };
}

// ---------------------------------------------------------------------
// Evaluation drafting / submission
// ---------------------------------------------------------------------

export async function createEvaluation(
  evaluatorUserId: string,
  participantId: string,
  isAdmin: boolean
) {
  if (!isAdmin) {
    await ensureAssigned(evaluatorUserId, participantId);
  }

  const existing = await prisma.evaluation.findFirst({
    where: { participantId, evaluatorUserId },
  });
  if (existing) {
    return existing; // idempotent: re-opening the draft returns the same row
  }

  return prisma.evaluation.create({
    data: { participantId, evaluatorUserId, status: EvaluationStatus.DRAFT },
  });
}

export async function getEvaluation(id: string) {
  const evaluation = await prisma.evaluation.findUnique({
    where: { id },
    include: { scores: { include: { criterion: true } }, participant: true },
  });
  if (!evaluation) {
    throw new EvaluationError("ارزیابی یافت نشد.", 404);
  }
  return evaluation;
}

/**
 * Access-controlled read: only the evaluator who owns the evaluation,
 * the participant it's about, or an admin may view it. Evaluations
 * contain private scoring commentary, so this is enforced at the
 * service layer rather than trusted to callers.
 */
export async function getEvaluationForRequester(
  id: string,
  requesterUserId: string,
  isAdmin: boolean
) {
  const evaluation = await getEvaluation(id);

  if (isAdmin || evaluation.evaluatorUserId === requesterUserId) {
    return evaluation;
  }

  const ownProfile = await prisma.participantProfile.findUnique({
    where: { userId: requesterUserId },
    select: { id: true },
  });
  if (ownProfile?.id === evaluation.participantId) {
    return evaluation;
  }

  throw new EvaluationError("شما اجازه مشاهده این ارزیابی را ندارید.", 403);
}

function assertOwnerOrAdmin(
  evaluation: { evaluatorUserId: string },
  requesterUserId: string,
  isAdmin: boolean
) {
  if (!isAdmin && evaluation.evaluatorUserId !== requesterUserId) {
    throw new EvaluationError("شما مالک این ارزیابی نیستید.", 403);
  }
}

/**
 * Persists scores as a draft (upsert per criterion) without finalizing.
 * Evaluators can save a draft repeatedly before submitting — spec §21/§28.
 */
export async function saveDraft(
  evaluationId: string,
  requesterUserId: string,
  isAdmin: boolean,
  input: SaveDraftInput
) {
  const evaluation = await getEvaluation(evaluationId);
  assertOwnerOrAdmin(evaluation, requesterUserId, isAdmin);

  if (evaluation.status === EvaluationStatus.SUBMITTED) {
    throw new EvaluationError(
      "این ارزیابی نهایی شده و قابل ویرایش نیست.",
      409
    );
  }

  await prisma.$transaction(
    input.scores.map((s) =>
      prisma.evaluationScore.upsert({
        where: {
          evaluationId_criterionId: {
            evaluationId,
            criterionId: s.criterionId,
          },
        },
        update: { score: s.score, comment: s.comment },
        create: {
          evaluationId,
          criterionId: s.criterionId,
          score: s.score,
          comment: s.comment,
        },
      })
    )
  );

  return prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      comment: input.comment,
      transformationScore: input.transformationScore,
    },
    include: { scores: { include: { criterion: true } } },
  });
}

/**
 * Finalizes the evaluation: computes the weighted final score from
 * whatever criteria were actually scored (normalized so a partially
 * scored rubric doesn't silently deflate the result), then locks it.
 */
export async function submitEvaluation(
  evaluationId: string,
  requesterUserId: string,
  isAdmin: boolean
) {
  const evaluation = await getEvaluation(evaluationId);
  assertOwnerOrAdmin(evaluation, requesterUserId, isAdmin);

  if (evaluation.scores.length === 0) {
    throw new EvaluationError(
      "قبل از ثبت نهایی باید حداقل یک معیار امتیازدهی شود.",
      400
    );
  }

  const totalWeight = evaluation.scores.reduce(
    (sum, s) => sum + s.criterion.weight,
    0
  );
  const finalScore =
    totalWeight > 0
      ? evaluation.scores.reduce(
          (sum, s) => sum + s.score * s.criterion.weight,
          0
        ) / totalWeight
      : null;

  return prisma.evaluation.update({
    where: { id: evaluationId },
    data: {
      status: EvaluationStatus.SUBMITTED,
      finalScore,
    },
    include: { scores: { include: { criterion: true } } },
  });
}
