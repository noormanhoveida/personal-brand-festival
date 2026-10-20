import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";

export class SituationError extends AppError {}

export async function listSituations() {
  return prisma.situation.findMany({ orderBy: { title: "asc" } });
}

export async function createSituation(input: { key: string; title: string }) {
  const existing = await prisma.situation.findUnique({ where: { key: input.key } });
  if (existing) {
    throw new SituationError("موقعیتی با این کلید قبلاً وجود دارد.", 409);
  }
  return prisma.situation.create({ data: input });
}
