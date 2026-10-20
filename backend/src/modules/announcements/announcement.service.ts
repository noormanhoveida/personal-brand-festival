import { PrismaClient, AnnouncementType } from '@prisma/client';

const prisma = new PrismaClient();

export class AnnouncementService {
  // ایجاد اعلان جدید (توسط ادمین)
  async createAnnouncement(data: { title: string; content: string; type?: AnnouncementType }) {
    return prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || AnnouncementType.INFO,
      },
    });
  }

  // دریافت لیست تمام اعلان‌ها (برای کاربران و ادمین)
  async getAnnouncements() {
    return prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // حذف اعلان (توسط ادمین)
  async deleteAnnouncement(id: string) {
    return prisma.announcement.delete({
      where: { id },
    });
  }
}
