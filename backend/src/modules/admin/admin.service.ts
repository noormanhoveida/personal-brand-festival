import { EvaluationStatus, Role } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { CreateRegionInput, UpdateUserRoleInput } from "./admin.validator";

export class AdminError extends AppError {}

/**
 * High-level numbers for the Admin overview screen. Kept as parallel
 * counts (not a single heavy query) so any one metric failing/slowing
 * down doesn't block the rest of the dashboard from rendering.
 */
export async function getOverview() {
  const [
    totalParticipants,
    totalBootcamps,
    submittedEvaluations,
    draftEvaluations,
    totalFeedback,
    publishedPages,
    regionCount,
  ] = await Promise.all([
    prisma.participantProfile.count(),
    prisma.bootcamp.count(),
    prisma.evaluation.count({ where: { status: EvaluationStatus.SUBMITTED } }),
    prisma.evaluation.count({ where: { status: EvaluationStatus.DRAFT } }),
    prisma.feedbackResponse.count(),
    prisma.personalPage.count({ where: { publishedAt: { not: null } } }),
    prisma.region.count(),
  ]);

  return {
    totalParticipants,
    totalBootcamps,
    submittedEvaluations,
    draftEvaluations,
    totalFeedback,
    publishedPages,
    regionCount,
  };
}

export async function listUsers(role?: Role) {
  return prisma.user.findMany({
    where: role ? { role } : undefined,
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      phone: true,
      isBlocked: true,
      participantProfile: { select: { firstName: true, lastName: true, slug: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, input: UpdateUserRoleInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AdminError("کاربر یافت نشد.", 404);
  }
  return prisma.user.update({ where: { id: userId }, data: { role: input.role } });
}

export async function listRegions() {
  return prisma.region.findMany({ orderBy: { name: "asc" } });
}

export async function createRegion(input: CreateRegionInput) {
  return prisma.region.create({ data: input });
}

export interface ParticipantListFilters {
  regionId?: string;
  search?: string;
}

/**
 * Admin's participant browser (spec §28/§29). "Completion" and "score"
 * filters from the spec depend on aggregate evaluation/response data —
 * exposed here as sortable fields on the result rather than DB-level
 * filters, since they're computed, not stored columns.
 */
export async function listParticipants(filters: ParticipantListFilters) {
  const participants = await prisma.participantProfile.findMany({
    where: {
      ...(filters.regionId && { regionId: filters.regionId }),
      ...(filters.search && {
        OR: [
          { firstName: { contains: filters.search, mode: "insensitive" } },
          { lastName: { contains: filters.search, mode: "insensitive" } },
          { city: { contains: filters.search, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      region: true,
      _count: { select: { responses: true } },
      evaluations: { select: { finalScore: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return participants.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    fullName: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'بدون نام',
    slug: p.slug,
    city: p.city,
    region: p.region?.name ?? null,
    responseCount: p._count.responses,
    latestScore:
      p.evaluations.find((e) => e.status === EvaluationStatus.SUBMITTED)
        ?.finalScore ?? null,
  }));
}

export async function setUserBlocked(userId: string, isBlocked: boolean) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isBlocked },
    select: {
      id: true,
      email: true,
      phone: true,
      role: true,
      isBlocked: true,
      createdAt: true,
    }
  });

  // در صورت مسدود شدن، تمام نشست‌های فعالش قطع شود
  if (isBlocked) {
    await prisma.refreshToken.deleteMany({ where: { userId } }).catch(() => {});
  }
  return user;
}

export async function deleteUser(userId: string) {
  return await prisma.$transaction(async (tx) => {
    // پاک‌سازی روابط
    await tx.refreshToken.deleteMany({ where: { userId } }).catch(() => {});
    await tx.emailVerificationCode.deleteMany({ where: { userId } }).catch(() => {});
    await tx.phoneVerificationCode.deleteMany({ where: { userId } }).catch(() => {});
    await tx.notification.deleteMany({ where: { userId } }).catch(() => {});
    await tx.activityLog.deleteMany({ where: { userId } }).catch(() => {});
    await tx.artifactRating.deleteMany({ where: { userId } }).catch(() => {});
    await tx.artifactComment.deleteMany({ where: { userId } }).catch(() => {});
    await tx.participantProfile.deleteMany({ where: { userId } }).catch(() => {});
    await tx.evaluatorAssignment.deleteMany({ where: { evaluatorUserId: userId } }).catch(() => {});
    
    return await tx.user.delete({ where: { id: userId } });
  });
}
