import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { sendMail } from "../../config/mailer";

export class ChallengeError extends AppError {}

async function getParticipantId(userId: string) {
  const profile = await prisma.participantProfile.findUnique({ where: { userId }, select: { id: true } });
  if (!profile) throw new ChallengeError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  return profile.id;
}

export async function createChallenge(
  createdByUserId: string,
  input: {
    title: string;
    description: string;
    instructorName?: string;
    instructorEmail?: string;
    opensAt?: string;
    deadline?: string;
  }
) {
  return prisma.weeklyChallenge.create({
    data: {
      title: input.title,
      description: input.description,
      instructorName: input.instructorName,
      instructorEmail: input.instructorEmail,
      opensAt: input.opensAt ? new Date(input.opensAt) : undefined,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
      createdByUserId,
    },
  });
}

export async function updateChallenge(
  challengeId: string,
  input: Partial<{
    title: string;
    description: string;
    instructorName: string;
    instructorEmail: string;
    opensAt: string;
    deadline: string;
    isActive: boolean;
  }>
) {
  const challenge = await prisma.weeklyChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new ChallengeError("این چالش یافت نشد.", 404);

  return prisma.weeklyChallenge.update({
    where: { id: challengeId },
    data: {
      ...input,
      opensAt: input.opensAt ? new Date(input.opensAt) : undefined,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    },
  });
}

export async function deleteChallenge(challengeId: string) {
  const challenge = await prisma.weeklyChallenge.findUnique({
    where: { id: challengeId },
    include: { _count: { select: { submissions: true } } },
  });
  if (!challenge) throw new ChallengeError("این چالش یافت نشد.", 404);
  if (challenge._count.submissions > 0) {
    throw new ChallengeError(
      "این چالش پاسخ ثبت‌شده دارد و قابل حذف نیست — به‌جای حذف، آن را غیرفعال کنید.",
      409
    );
  }
  await prisma.weeklyChallenge.delete({ where: { id: challengeId } });
}

export async function listChallenges(onlyActive: boolean) {
  return prisma.weeklyChallenge.findMany({
    where: onlyActive ? { isActive: true } : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function getChallenge(challengeId: string) {
  const challenge = await prisma.weeklyChallenge.findUnique({ where: { id: challengeId } });
  if (!challenge) throw new ChallengeError("این چالش یافت نشد.", 404);
  return challenge;
}

export async function getMySubmission(challengeId: string, userId: string) {
  const participantId = await getParticipantId(userId);
  return prisma.challengeSubmission.findUnique({
    where: { challengeId_participantId: { challengeId, participantId } },
    include: {
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
  });
}

/**
 * Append-only versioning for challenge submissions:
 * Every edit appends a new ChallengeSubmissionVersion with an incremented versionNumber.
 */
export async function submitWork(
  challengeId: string,
  userId: string,
  input: { textContent?: string; photoUrl?: string; documentUrl?: string; linkUrl?: string }
) {
  const participantId = await getParticipantId(userId);
  const challenge = await getChallenge(challengeId);
  if (!challenge.isActive) {
    throw new ChallengeError("این چالش دیگر فعال نیست.", 400);
  }
  if (!input.textContent && !input.photoUrl && !input.documentUrl && !input.linkUrl) {
    throw new ChallengeError("حداقل یکی از بخش‌های متن، عکس، فایل یا لینک باید ارسال شود.", 400);
  }

  return prisma.$transaction(async (tx) => {
    let submission = await tx.challengeSubmission.findUnique({
      where: { challengeId_participantId: { challengeId, participantId } },
      include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
    });

    if (!submission) {
      submission = await tx.challengeSubmission.create({
        data: {
          challengeId,
          participantId,
          textContent: input.textContent,
          photoUrl: input.photoUrl,
          documentUrl: input.documentUrl,
          linkUrl: input.linkUrl,
        },
        include: { versions: true },
      });
    } else {
      submission = await tx.challengeSubmission.update({
        where: { id: submission.id },
        data: {
          textContent: input.textContent,
          photoUrl: input.photoUrl,
          documentUrl: input.documentUrl,
          linkUrl: input.linkUrl,
        },
        include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
      });
    }

    const latestVersion = submission.versions?.[0]?.versionNumber || 0;
    const nextVersionNumber = latestVersion + 1;

    await tx.challengeSubmissionVersion.create({
      data: {
        challengeSubmissionId: submission.id,
        versionNumber: nextVersionNumber,
        textContent: input.textContent,
        photoUrl: input.photoUrl,
        documentUrl: input.documentUrl,
        linkUrl: input.linkUrl,
      },
    });

    return tx.challengeSubmission.findUnique({
      where: { id: submission.id },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
        },
      },
    });
  });
}

export async function listSubmissionsForChallenge(challengeId: string) {
  return prisma.challengeSubmission.findMany({
    where: { challengeId },
    include: {
      participant: {
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
      },
      versions: {
        orderBy: { versionNumber: "desc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function sendSubmissionToInstructor(submissionId: string) {
  const submission = await prisma.challengeSubmission.findUnique({
    where: { id: submissionId },
    include: {
      challenge: true,
      participant: { include: { user: true } },
      versions: { orderBy: { versionNumber: "desc" } },
    },
  });

  if (!submission) throw new ChallengeError("پاسخ یافت نشد.", 404);
  if (!submission.challenge.instructorEmail) {
    throw new ChallengeError("ایمیل مدرس برای این چالش تعریف نشده است.", 400);
  }

  const pProfile = submission.participant;
  const pUser = pProfile.user;
  const pName = `${pProfile.firstName || ""} ${pProfile.lastName || ""}`.trim() || pUser.email;

  const bodyText = `پاسخ چالش برای بررسی ارسال شد:
چالش: ${submission.challenge.title}
شرکت‌کننده: ${pName} (${pUser.email})
تعداد ویرایش‌ها/نسخه‌ها: ${submission.versions.length}
متن آخرین نسخه: ${submission.textContent || "(بدون متن)"}
لینک پیوست: ${submission.linkUrl || "(ندارد)"}
فایل: ${submission.documentUrl || "(ندارد)"}
عکس: ${submission.photoUrl || "(ندارد)"}
`;

  await sendMail({
    to: submission.challenge.instructorEmail,
    subject: `[جشنواره برند شخصی] پاسخ ارسالی چالش: ${submission.challenge.title} از ${pName}`,
    text: bodyText,
    html: `<div dir="rtl" style="font-family: sans-serif; text-align: right; whitespace: pre-wrap;">${bodyText.replace(/\n/g, "<br/>")}</div>`,
  });

  return prisma.challengeSubmission.update({
    where: { id: submissionId },
    data: { sentToInstructorAt: new Date() },
  });
}
