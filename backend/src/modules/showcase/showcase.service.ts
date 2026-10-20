import { Visibility } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { SetFeaturedInput, SetFinalistInput, SetWinnerInput } from "./showcase.validator";

export class ShowcaseError extends AppError {}

async function ensurePersonalPage(participantId: string) {
  let page = await prisma.personalPage.findUnique({ where: { participantId } });
  if (!page) {
    // در صورتی که هنوز صفحه نساخته باشد، برای اینکه بتوان فینالیست/برجسته کرد یک صفحه پایه ایجاد می‌کنیم
    page = await prisma.personalPage.create({
      data: {
        participantId,
        identityWords: [],
      },
    });
  }
  return page;
}

export async function setFeatured(participantId: string, input: SetFeaturedInput) {
  await ensurePersonalPage(participantId);
  return prisma.personalPage.update({
    where: { participantId },
    data: { featured: input.featured },
  });
}

export async function setFinalist(participantId: string, input: SetFinalistInput) {
  await ensurePersonalPage(participantId);
  return prisma.personalPage.update({
    where: { participantId },
    data: { finalist: input.finalist },
  });
}

export async function setWinner(participantId: string, input: SetWinnerInput) {
  await ensurePersonalPage(participantId);
  return prisma.personalPage.update({
    where: { participantId },
    data: { winnerCategory: input.winnerCategory ? input.winnerCategory.trim() : null },
  });
}

export async function getAdminShowcaseList() {
  const participants = await prisma.participantProfile.findMany({
    include: {
      personalPage: true,
      media: { take: 1, orderBy: { order: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  // استخراج تمام دسته‌های منحصربه‌فرد ثبت‌شده تا کنون همراه با تعداد شرکت‌کنندگان
  const categoriesMap = new Map<string, { count: number; active: boolean }>();

  participants.forEach((p) => {
    const cat = p.personalPage?.winnerCategory;
    if (cat && cat.trim()) {
      const existing = categoriesMap.get(cat) || { count: 0, active: true };
      existing.count += 1;
      categoriesMap.set(cat, existing);
    }
  });

  const categories = Array.from(categoriesMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    active: data.active,
  }));

  return {
    participants: participants.map((p) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      fullName: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "بدون نام",
      city: p.city,
      slug: p.slug,
      avatarUrl: p.media[0]?.url ?? null,
      featured: p.personalPage?.featured ?? false,
      finalist: p.personalPage?.finalist ?? false,
      winnerCategory: p.personalPage?.winnerCategory ?? null,
      isPublished: Boolean(p.personalPage?.publishedAt),
    })),
    categories,
  };
}

// تغییر نام یک دسته در تمام شرکت‌کنندگان یا پاک کردن یک دسته
export async function renameCategory(oldName: string, newName: string | null) {
  return prisma.personalPage.updateMany({
    where: { winnerCategory: oldName },
    data: { winnerCategory: newName ? newName.trim() : null },
  });
}

export async function getPublicShowcase() {
  const pages = await prisma.personalPage.findMany({
    where: {
      publishedAt: { not: null },
      participant: { pageVisibility: Visibility.PUBLIC },
      OR: [
        { featured: true },
        { finalist: true },
        { winnerCategory: { not: null } },
      ],
    },
    include: {
      participant: {
        select: {
          firstName: true,
          lastName: true,
          slug: true,
          city: true,
          professionalField: true,
          media: { take: 1, orderBy: { order: "asc" } },
        },
      },
    },
  });

  const toCard = (p: (typeof pages)[number]) => ({
    slug: p.participant.slug,
    fullName: `${p.participant.firstName} ${p.participant.lastName}`,
    city: p.participant.city,
    professionalField: p.participant.professionalField,
    tagline: p.tagline,
    coverImage: p.participant.media[0]?.url ?? null,
  });

  const featured = pages.filter((p) => p.featured).map(toCard);
  const finalists = pages.filter((p) => p.finalist).map(toCard);

  const winnersByCategory = new Map<string, ReturnType<typeof toCard>[]>();
  for (const p of pages) {
    if (!p.winnerCategory) continue;
    const list = winnersByCategory.get(p.winnerCategory) ?? [];
    list.push(toCard(p));
    winnersByCategory.set(p.winnerCategory, list);
  }

  return {
    featured,
    finalists,
    winners: Object.fromEntries(winnersByCategory),
  };
}
