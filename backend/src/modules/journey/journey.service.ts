import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";

export class JourneyError extends AppError {}

export async function listJourneySections(includeDeleted = false) {
  const whereClause = includeDeleted ? {} : { deletedAt: null };
  return prisma.journeySection.findMany({
    where: whereClause,
    orderBy: { order: "asc" },
  });
}

/**
 * Admin authoring of the roadmap itself — the 8-or-so lit/unlit
 * points participants walk through. Previously this only existed as
 * seed data; `key` stays admin-supplied (not auto-slugified) since
 * it's a stable identifier other config may reference by name, same
 * as the seeded sections ("identity", "strengths", ...).
 */
export async function createJourneySection(input: {
  key: string;
  title: string;
  description?: string;
  order?: number;
}) {
  const existing = await prisma.journeySection.findUnique({ where: { key: input.key } });
  if (existing) {
    throw new JourneyError("بخشی با این شناسه (key) از قبل وجود دارد.", 409);
  }
  const order = input.order ?? (await prisma.journeySection.count());
  return prisma.journeySection.create({
    data: { key: input.key, title: input.title, description: input.description, order },
  });
}

export async function updateJourneySection(
  sectionId: string,
  input: { title?: string; description?: string; order?: number }
) {
  const section = await prisma.journeySection.findUnique({ where: { id: sectionId } });
  if (!section) {
    throw new JourneyError("این بخش از مسیر برند شخصی یافت نشد.", 404);
  }
  return prisma.journeySection.update({ where: { id: sectionId }, data: input });
}

/**
 * Refuses to delete a section that still has questions or bootcamps
 * pointing at it — deleting it would silently orphan a participant's
 * already-answered questions off the roadmap. Reassign or remove
 * those first; this is a deliberate guardrail, not a limitation to
 * work around.
 */
export async function deleteJourneySection(sectionId: string, force = false) {
  const section = await prisma.journeySection.findUnique({
    where: { id: sectionId },
    include: { questions: true, bootcamps: true },
  });

  if (!section) {
    throw new JourneyError("این بخش از مسیر برند شخصی یافت نشد.", 404);
  }

  const hasDependencies = section.questions.length > 0 || section.bootcamps.length > 0;
  if (hasDependencies && !force) {
    throw new JourneyError(
      `این بخش دارای ${section.questions.length} سوال و ${section.bootcamps.length} بوت‌کمپ متصل است. برای حذف از تایید اجباری استفاده کنید.`,
      409
    );
  }

  if (hasDependencies && force) {
    // قطع اتصال بوت‌کمپ‌ها بدون حذف آن‌ها
    await prisma.bootcamp.updateMany({
      where: { journeySectionId: sectionId },
      data: { journeySectionId: null },
    });

    // قطع اتصال سوالات مرتبط بدون حذف پاسخ‌های کاربران
    await prisma.question.updateMany({
      where: { journeySectionId: sectionId },
      data: { journeySectionId: null },
    });
  }

  await prisma.journeySection.update({
    where: { id: sectionId },
    data: { deletedAt: new Date() },
  });
}

export async function getJourneySectionById(sectionId: string) {
  const section = await prisma.journeySection.findUnique({
    where: { id: sectionId },
    include: {
      questions: { orderBy: { order: "asc" } },
      bootcamps: { orderBy: { date: "asc" } },
    },
  });

  if (!section) {
    throw new JourneyError("این بخش از مسیر برند شخصی یافت نشد.", 404);
  }

  return section;
}

/**
 * A question attached directly to a journey section, with no bootcamp
 * involved — for standalone roadmap prompts like "درباره هویت خودت
 * بنویس" that aren't tied to any specific workshop.
 */
export async function addSectionQuestion(
  sectionId: string,
  input: {
    text: string;
    inputType: any;
    situationId?: string;
  }
) {
  const section = await prisma.journeySection.findUnique({ where: { id: sectionId } });
  if (!section) {
    const err: any = new Error("بخش یافت نشد");
    err.statusCode = 404;
    throw err;
  }

  return prisma.question.create({
    data: {
      text: input.text,
      inputType: input.inputType,
      situationId: input.situationId || null,
      journeySectionId: sectionId,
      stage: "CURRENT" as any,
    },
  });
}

export async function attachQuestionToSection(sectionId: string, questionId: string) {
  const section = await prisma.journeySection.findUnique({ where: { id: sectionId } });
  if (!section) {
    const err: any = new Error("بخش یافت نشد");
    err.statusCode = 404;
    throw err;
  }

  return prisma.question.update({
    where: { id: questionId },
    data: { journeySectionId: sectionId },
  });
}

export async function updateQuestion(
  questionId: string,
  data: {
    text?: string;
    stage?: any;
    inputType?: any;
    options?: any;
    situationId?: string;
    order?: number;
  }
) {
  const existing = await prisma.question.findUnique({ where: { id: questionId } });
  if (!existing) {
    const err: any = new Error("سؤال یافت نشد");
    err.statusCode = 404;
    throw err;
  }

  return prisma.question.update({
    where: { id: questionId },
    data: {
      ...(data.text !== undefined && { text: data.text }),
      ...(data.stage !== undefined && { stage: data.stage }),
      ...(data.inputType !== undefined && { inputType: data.inputType }),
      ...(data.options !== undefined && { options: data.options }),
      ...(data.situationId !== undefined && { situationId: data.situationId || null }),
      ...(data.order !== undefined && { order: data.order }),
    },
  });
}

export async function deleteQuestion(questionId: string) {
  return prisma.question.delete({
    where: { id: questionId },
  });
}
