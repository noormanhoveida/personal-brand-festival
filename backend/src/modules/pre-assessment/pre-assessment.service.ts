import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { PreAssessmentInput } from "./pre-assessment.validator";
import { DigitalPresenceEntry, SelfAssessmentEntry } from "./pre-assessment.constants";

export class PreAssessmentError extends AppError {}

async function getParticipant(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    include: { user: { select: { email: true } } },
  });
  if (!profile) {
    throw new PreAssessmentError("ابتدا باید فرآیند تکمیل پروفایل (onboarding) را انجام دهید.", 400);
  }
  return profile;
}

/**
 * Drives the mandatory popup: whether it's already been completed,
 * and — for the "اطلاعات پایه" sheet's fields that duplicate the
 * profile — the values to prefill so the participant is never asked
 * for their name twice. Fields with no profile equivalent (university,
 * social links, program goal, etc.) aren't in here; the form starts
 * those blank.
 */
export async function getStatus(userId: string) {
  const profile = await getParticipant(userId);
  const existing = await prisma.preAssessment.findUnique({ where: { participantId: profile.id } });

  return {
    completed: existing !== null,
    prefill: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      mobile: profile.mobile,
      email: profile.user.email,
      educationLevel: profile.educationLevel ?? "",
      fieldOfStudy: profile.fieldOfStudy ?? "",
    },
  };
}

export async function submit(userId: string, input: PreAssessmentInput) {
  const profile = await getParticipant(userId);

  const existing = await prisma.preAssessment.findUnique({ where: { participantId: profile.id } });
  if (existing) {
    throw new PreAssessmentError("پیش‌ارزیابی قبلاً ثبت شده است.", 409);
  }

  return prisma.preAssessment.create({
    data: {
      participantId: profile.id,
      university: input.university,
      linkedinUrl: input.linkedinUrl || null,
      personalWebsiteUrl: input.personalWebsiteUrl || null,
      instagramHandle: input.instagramHandle || null,
      programGoal: input.programGoal,
      goalDescription: input.goalDescription || null,
      selfAssessment: input.selfAssessment,
      qualitativeAnswers: input.qualitativeAnswers,
      digitalPresence: input.digitalPresence,
    },
  });
}

export async function getMine(userId: string) {
  const profile = await getParticipant(userId);
  return prisma.preAssessment.findUnique({ where: { participantId: profile.id } });
}

/**
 * §Sheet 5 "خلاصه و امتیاز کلی" — entirely derived, never stored, so
 * it can't drift from the answers it summarizes. Mirrors the sheet's
 * three columns: شاخص (indicator) / مقدار (value) / and the
 * coordinator's free-text note (which IS stored, since it's the one
 * thing a person writes rather than the system computing).
 */
function buildSummary(assessment: {
  selfAssessment: unknown;
  digitalPresence: unknown;
  coordinatorNote: string | null;
}) {
  const axes = assessment.selfAssessment as SelfAssessmentEntry[];
  const platforms = assessment.digitalPresence as DigitalPresenceEntry[];

  const avgCurrent = axes.reduce((s, a) => s + a.current, 0) / axes.length;
  const avgTarget = axes.reduce((s, a) => s + a.target, 0) / axes.length;
  const avgGap = avgTarget - avgCurrent;

  const activePlatforms = platforms.filter((p) => p.has);
  const avgQuality =
    activePlatforms.length > 0
      ? activePlatforms.reduce((s, p) => s + (p.quality ?? 0), 0) / activePlatforms.length
      : 0;

  return {
    selfAssessment: axes.map((a) => ({ ...a, gap: a.target - a.current })),
    selfAssessmentAverage: { current: avgCurrent, target: avgTarget, gap: avgGap },
    digitalPresence: platforms,
    digitalPresenceTotals: { activeCount: activePlatforms.length, averageQuality: avgQuality },
    coordinatorNote: assessment.coordinatorNote,
  };
}

/** Evaluator/admin view: the raw answers plus the derived summary. */
export async function getForParticipant(participantId: string) {
  const assessment = await prisma.preAssessment.findUnique({
    where: { participantId },
    include: { participant: true },
  });
  if (!assessment) throw new PreAssessmentError("پیش‌ارزیابی برای این شرکت‌کننده ثبت نشده است.", 404);

  return { ...assessment, summary: buildSummary(assessment) };
}

export async function setCoordinatorNote(participantId: string, note: string) {
  const assessment = await prisma.preAssessment.findUnique({ where: { participantId } });
  if (!assessment) throw new PreAssessmentError("پیش‌ارزیابی برای این شرکت‌کننده ثبت نشده است.", 404);

  return prisma.preAssessment.update({ where: { participantId }, data: { coordinatorNote: note } });
}

/**
 * The admin-panel overview: every participant, with their submission
 * status — this is what was missing before (the backend + the
 * per-participant detail view existed, but nothing surfaced them in
 * the admin nav, so there was no way to discover who'd submitted).
 */
export async function listAllForAdmin() {
  const profiles = await prisma.participantProfile.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      preAssessment: { select: { submittedAt: true } },
    },
    orderBy: { firstName: "asc" },
  });

  return profiles.map((p) => ({
    participantId: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    completed: p.preAssessment !== null,
    submittedAt: p.preAssessment?.submittedAt ?? null,
  }));
}
