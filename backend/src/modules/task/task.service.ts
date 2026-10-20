import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { TaskInput, TaskSubmissionInput } from "./task.validator";

export class TaskError extends AppError {}

export async function createTask(bootcampId: string, input: TaskInput) {
  const bootcamp = await prisma.bootcamp.findUnique({ where: { id: bootcampId } });
  if (!bootcamp) {
    throw new TaskError("بوت‌کمپ یافت نشد.", 404);
  }
  return prisma.task.create({ data: { bootcampId, ...input } });
}

export async function listBootcampTasks(bootcampId: string) {
  return prisma.task.findMany({ where: { bootcampId } });
}

async function getParticipantIdForUser(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  if (!profile) {
    throw new TaskError("ابتدا باید پروفایل خود را تکمیل کنید.", 404);
  }
  return profile.id;
}

/**
 * Submissions are append-only, matching the platform's overall
 * versioning philosophy — a participant can submit more than once
 * (e.g. after revising), and every attempt stays visible rather than
 * being overwritten.
 */
export async function submitTask(
  userId: string,
  taskId: string,
  input: TaskSubmissionInput
) {
  const participantId = await getParticipantIdForUser(userId);

  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) {
    throw new TaskError("تکلیف یافت نشد.", 404);
  }

  return prisma.taskSubmission.create({
    data: { taskId, participantId, content: input.content },
  });
}

export async function listOwnSubmissions(userId: string, taskId: string) {
  const participantId = await getParticipantIdForUser(userId);
  return prisma.taskSubmission.findMany({
    where: { taskId, participantId },
    orderBy: { createdAt: "desc" },
  });
}
