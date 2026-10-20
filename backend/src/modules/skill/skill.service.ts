import { EndorsementVote } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { AddSkillInput, EndorseSkillInput } from "./skill.validator";

export class SkillError extends AppError {}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new SkillError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

function withCounts<T extends { endorsements: { vote: EndorsementVote }[] }>(skill: T) {
  const endorseCount = skill.endorsements.filter((e) => e.vote === EndorsementVote.ENDORSE).length;
  const rejectCount = skill.endorsements.filter((e) => e.vote === EndorsementVote.REJECT).length;
  const { endorsements, ...rest } = skill;
  return { ...rest, endorseCount, rejectCount };
}

export async function listOwnSkills(userId: string) {
  const participantId = await getParticipantIdForUser(userId);
  const skills = await prisma.skill.findMany({
    where: { participantId },
    include: { endorsements: true },
    orderBy: { createdAt: "asc" },
  });
  return skills.map(withCounts);
}

export async function addSkill(userId: string, input: AddSkillInput) {
  const participantId = await getParticipantIdForUser(userId);

  const existing = await prisma.skill.findUnique({
    where: { participantId_name: { participantId, name: input.name } },
  });
  if (existing) {
    throw new SkillError("این مهارت قبلاً ثبت شده است.", 409);
  }

  return prisma.skill.create({ data: { participantId, name: input.name } });
}

export async function deleteSkill(userId: string, skillId: string) {
  const participantId = await getParticipantIdForUser(userId);

  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill || skill.participantId !== participantId) {
    throw new SkillError("مهارت یافت نشد.", 404);
  }

  await prisma.skill.delete({ where: { id: skillId } });
}

/**
 * Public — no auth required, mirroring the "آینه من" feedback pattern:
 * the people best placed to vouch for a skill (a colleague, a client)
 * often don't have an account on the platform.
 */
export async function endorseSkill(skillId: string, input: EndorseSkillInput) {
  const skill = await prisma.skill.findUnique({ where: { id: skillId } });
  if (!skill) {
    throw new SkillError("مهارت یافت نشد.", 404);
  }

  return prisma.skillEndorsement.create({
    data: {
      skillId,
      vote: input.vote,
      endorserName: input.endorserName,
    },
  });
}

/** Used by the public personal page to show skills with vote counts. */
export async function listPublicSkills(participantId: string) {
  const skills = await prisma.skill.findMany({
    where: { participantId },
    include: { endorsements: true },
    orderBy: { createdAt: "asc" },
  });
  return skills.map(withCounts);
}

/**
 * Every distinct skill name across the whole platform — the pool
 * behind the feedback form's tag picker. Someone giving feedback may
 * not think of a trait unprompted, but recognizes it immediately when
 * shown a list of tags other members have used; this is also how a
 * skill the person never listed for themselves can still reach their
 * profile through someone else noticing it.
 */
export async function listAllSkillTags() {
  const skills = await prisma.skill.findMany({
    select: { name: true },
    distinct: ["name"],
    orderBy: { name: "asc" },
  });
  return skills.map((s) => s.name);
}

/**
 * Public — no auth. Used when someone leaves feedback and picks tags
 * for the person they're reviewing. If the participant doesn't already
 * have a skill by that name, it's created — this is precisely how a
 * trait the person doesn't see in themselves can still surface: an
 * endorsement from someone else is what puts it on their profile.
 */
export async function endorseSkillsByTagForParticipant(
  slug: string,
  tagNames: string[],
  endorserName?: string
) {
  const participant = await prisma.participantProfile.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!participant) {
    throw new SkillError("این شرکت‌کننده یافت نشد.", 404);
  }

  const uniqueNames = [...new Set(tagNames.map((n) => n.trim()).filter(Boolean))];

  for (const name of uniqueNames) {
    const skill = await prisma.skill.upsert({
      where: { participantId_name: { participantId: participant.id, name } },
      update: {},
      create: { participantId: participant.id, name },
    });
    await prisma.skillEndorsement.create({
      data: { skillId: skill.id, vote: EndorsementVote.ENDORSE, endorserName },
    });
  }

  return uniqueNames;
}
