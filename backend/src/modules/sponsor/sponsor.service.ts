import { PrismaClient, SponsorPlacement } from "@prisma/client";

const prisma = new PrismaClient();

export class SponsorService {
  static async getActiveByPlacement(placement?: SponsorPlacement) {
    return prisma.sponsor.findMany({
      where: {
        isActive: true,
        ...(placement ? { placement } : {}),
      },
      orderBy: [
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });
  }

  static async getBySlug(slug: string) {
    return prisma.sponsor.findUnique({
      where: { slug },
    });
  }

  static async getAllAdmin(filters?: { placement?: SponsorPlacement; isActive?: boolean }) {
    return prisma.sponsor.findMany({
      where: {
        ...(filters?.placement ? { placement: filters.placement } : {}),
        ...(typeof filters?.isActive === "boolean" ? { isActive: filters.isActive } : {}),
      },
      orderBy: [
        { placement: "asc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });
  }

  static async getById(id: string) {
    return prisma.sponsor.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.sponsor.create({
      data,
    });
  }

  static async update(id: string, data: any) {
    return prisma.sponsor.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return prisma.sponsor.delete({
      where: { id },
    });
  }

  // ثبت اتمیک بازدید اسلاید بدون ایجاد race-condition
  static async incrementView(id: string) {
    return prisma.sponsor.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
      select: { id: true, slug: true, viewCount: true, clickCount: true },
    });
  }

  // ثبت اتمیک کلیک روی اسلاید
  static async incrementClick(id: string) {
    return prisma.sponsor.update({
      where: { id },
      data: {
        clickCount: { increment: 1 },
      },
      select: { id: true, slug: true, viewCount: true, clickCount: true },
    });
  }
}
