import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import {
  BootcampInput,
  BootcampUpdateInput,
  QuestionInput,
} from "./bootcamp.validator";

export class BootcampError extends AppError {}

export async function listBootcamps() {
  return prisma.bootcamp.findMany({
    orderBy: { date: "asc" },
    include: { journeySection: true },
  });
}

export async function getBootcampById(id: string) {
  const bootcamp = await prisma.bootcamp.findUnique({
    where: { id },
    include: {
      journeySection: true,
      questions: { orderBy: { order: "asc" } },
      tasks: true,
    },
  });

  if (!bootcamp) {
    throw new BootcampError("بوت‌کمپ یافت نشد.", 404);
  }

  return bootcamp;
}

export async function createBootcamp(input: BootcampInput) {
  return prisma.bootcamp.create({
    data: {
      title: input.title,
      description: input.description,
      instructor: input.instructor,
      coverImageUrl: input.coverImageUrl,
      teaserVideoUrl: input.teaserVideoUrl,
      date: input.date,
      startTime: input.startTime,
      endTime: input.endTime,
      deadline: input.deadline,
      journeySectionId: input.journeySectionId,
    },
  });
}

export async function updateBootcamp(id: string, input: BootcampUpdateInput) {
  await ensureExists(id);

  return prisma.bootcamp.update({
    where: { id },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.instructor !== undefined && { instructor: input.instructor }),
      ...(input.coverImageUrl !== undefined && {
        coverImageUrl: input.coverImageUrl,
      }),
      ...(input.teaserVideoUrl !== undefined && {
        teaserVideoUrl: input.teaserVideoUrl,
      }),
      ...(input.date !== undefined && { date: input.date }),
      ...(input.startTime !== undefined && { startTime: input.startTime }),
      ...(input.endTime !== undefined && { endTime: input.endTime }),
      ...(input.deadline !== undefined && { deadline: input.deadline }),
      ...(input.journeySectionId !== undefined && {
        journeySectionId: input.journeySectionId,
      }),
    },
  });
}

/**
 * Status is a distinct, explicit action (open a section, close
 * submissions, mark completed) rather than a side effect of a generic
 * PUT — this mirrors how a bootcamp manager actually works day to day
 * and keeps an unambiguous audit point for each transition.
 */
export async function setBootcampStatus(
  id: string,
  status: import("@prisma/client").BootcampStatus
) {
  await ensureExists(id);
  return prisma.bootcamp.update({ where: { id }, data: { status } });
}

export async function addQuestion(bootcampId: string, input: QuestionInput) {
  const bootcamp = await ensureExists(bootcampId);

  return prisma.question.create({
    data: {
      text: input.text,
      stage: input.stage,
      inputType: input.inputType,
      situationId: input.situationId,
      options: input.options ?? [],
      order: input.order ?? 0,
      bootcampId,
      journeySectionId: bootcamp.journeySectionId,
    },
  });
}

async function ensureExists(id: string) {
  const bootcamp = await prisma.bootcamp.findUnique({ where: { id } });
  if (!bootcamp) {
    throw new BootcampError("بوت‌کمپ یافت نشد.", 404);
  }
  return bootcamp;
}

/**
 * Attaches an existing standalone question (e.g. from the trait/
 * situation question bank) to this bootcamp, instead of authoring a
 * new one.
 */
export async function attachQuestionToBootcamp(bootcampId: string, questionId: string) {
  await ensureExists(bootcampId);
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    throw new BootcampError("سؤال یافت نشد.", 404);
  }
  return prisma.question.update({
    where: { id: questionId },
    data: { bootcampId },
  });
}
