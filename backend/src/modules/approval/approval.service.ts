// backend/src/modules/approval/approval.service.ts
import { ApprovalStatus } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";

export class ApprovalError extends AppError {}

async function assertCanReview(
  participantId: string,
  evaluatorUserId: string,
  isAdmin: boolean
) {
  if (isAdmin) return;
  const assignment = await prisma.evaluatorAssignment.findUnique({
    where: { evaluatorUserId_participantId: { evaluatorUserId, participantId } },
  });
  if (!assignment) {
    throw new ApprovalError(
      "شما به این شرکت‌کننده به‌عنوان ارزیاب اختصاص داده نشده‌اید.",
      403
    );
  }
}

export async function listPendingForReviewer(evaluatorUserId: string, isAdmin: boolean) {
  // Fetch assigned participant IDs up-front so the where clauses stay typed correctly.
  const assignedParticipantIds: string[] | null = isAdmin
    ? null
    : (
        await prisma.evaluatorAssignment.findMany({
          where: { evaluatorUserId },
          select: { participantId: true },
        })
      ).map((a) => a.participantId);

  const [responseVersions, taskSubmissions] = await Promise.all([
    prisma.responseVersion.findMany({
      where: {
        approvalStatus: ApprovalStatus.PENDING,
        ...(assignedParticipantIds !== null && {
          response: { participantId: { in: assignedParticipantIds } },
        }),
      },
      include: {
        response: {
          include: {
            question: true,
            participant: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.taskSubmission.findMany({
      where: {
        approvalStatus: ApprovalStatus.PENDING,
        ...(assignedParticipantIds !== null && {
          participantId: { in: assignedParticipantIds },
        }),
      },
      include: {
        task: true,
        participant: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  return { responseVersions, taskSubmissions };
}

export async function decideResponseVersion(
  versionId: string,
  evaluatorUserId: string,
  isAdmin: boolean,
  status: "APPROVED" | "REJECTED"
) {
  const version = await prisma.responseVersion.findUnique({
    where: { id: versionId },
    include: { response: { select: { participantId: true } } },
  });
  if (!version) {
    throw new ApprovalError("پاسخ یافت نشد.", 404);
  }
  await assertCanReview(version.response.participantId, evaluatorUserId, isAdmin);

  return prisma.responseVersion.update({
    where: { id: versionId },
    data: { approvalStatus: status, approvedBy: evaluatorUserId, approvedAt: new Date() },
  });
}

export async function decideTaskSubmission(
  submissionId: string,
  evaluatorUserId: string,
  isAdmin: boolean,
  status: "APPROVED" | "REJECTED",
  score?: number
) {
  const submission = await prisma.taskSubmission.findUnique({ where: { id: submissionId } });
  if (!submission) {
    throw new ApprovalError("ارسال یافت نشد.", 404);
  }
  await assertCanReview(submission.participantId, evaluatorUserId, isAdmin);

  return prisma.taskSubmission.update({
    where: { id: submissionId },
    data: {
      approvalStatus: status,
      approvedBy: evaluatorUserId,
      approvedAt: new Date(),
      ...(status === "APPROVED" && score !== undefined ? { score } : {}),
    },
  });
}

export async function getParticipantPoints(participantId: string) {
  const [approvedResponses, approvedTasks] = await Promise.all([
    prisma.responseVersion.count({
      where: { approvalStatus: ApprovalStatus.APPROVED, response: { participantId } },
    }),
    prisma.taskSubmission.count({
      where: { approvalStatus: ApprovalStatus.APPROVED, participantId },
    }),
  ]);

  const [pendingResponses, pendingTasks] = await Promise.all([
    prisma.responseVersion.count({
      where: { approvalStatus: ApprovalStatus.PENDING, response: { participantId } },
    }),
    prisma.taskSubmission.count({
      where: { approvalStatus: ApprovalStatus.PENDING, participantId },
    }),
  ]);

  return {
    points: approvedResponses + approvedTasks,
    pending: pendingResponses + pendingTasks,
  };
}

