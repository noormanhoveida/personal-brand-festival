import fs from "fs";
import path from "path";
import { prisma } from "../../config/db";
import { uploadDirAbsolutePath } from "../../config/upload";
import { BusinessCategory, BusinessVideoStatus } from "@prisma/client";

const userSelect = {
  id: true,
  participantProfile: {
    select: {
      firstName: true,
      lastName: true,
    },
  },
};

export class BusinessShowcaseService {
  /**
   * لیست ویدیوهای تایید شده برای ویترین عمومی
   */
  async getPublicList(category?: BusinessCategory, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const where: any = { status: BusinessVideoStatus.APPROVED };
    if (category) where.category = category;

    const [items, total] = await Promise.all([
      prisma.businessVideo.findMany({
        where,
        orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
        include: {
          user: { select: userSelect },
          _count: { select: { comments: true, likes: true } },
        },
      }),
      prisma.businessVideo.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * مشاهده جزییات یک ویدیو + افزایش شمارنده بازدید
   */
  async getById(id: string, currentUserId?: string, isAdmin = false) {
    const video = await prisma.businessVideo.findUnique({
      where: { id },
      include: {
        user: { select: userSelect },
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!video) return null;

    // کاربران عادی فقط می‌توانند ویدیوی تایید شده یا ویدیوی خودشان را ببینند
    if (!isAdmin && video.status !== BusinessVideoStatus.APPROVED && video.userId !== currentUserId) {
      return null;
    }

    // افزایش بازدید در پس‌زمینه
    await prisma.businessVideo.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    let isLikedByCurrentUser = false;
    if (currentUserId) {
      const like = await prisma.businessVideoLike.findUnique({
        where: {
          videoId_userId: { videoId: id, userId: currentUserId },
        },
      });
      isLikedByCurrentUser = !!like;
    }

    return { ...video, isLikedByCurrentUser };
  }

  /**
   * دریافت ویدیوهای متعلق به کاربر جاری
   */
  async getMyVideos(userId: string) {
    return prisma.businessVideo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { comments: true, likes: true } },
      },
    });
  }

  /**
   * ثبت ویدیوی جدید
   */
  async createVideo(userId: string, data: any) {
    return prisma.businessVideo.create({
      data: {
        userId,
        businessName: data.businessName,
        ownerName: data.ownerName,
        category: data.category || BusinessCategory.OTHER,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl,
        fileSizeBytes: data.fileSizeBytes || 0,
        durationSeconds: data.durationSeconds || 0,
        description: data.description,
        websiteUrl: data.websiteUrl,
        instagramUrl: data.instagramUrl,
        telegramUrl: data.telegramUrl,
        phoneNumber: data.phoneNumber,
        status: BusinessVideoStatus.PENDING,
      },
    });
  }

  /**
   * حذف ویدیو و پاک کردن فایل فیزیکی آن از دیسک
   */
  async deleteVideo(id: string, userId: string, isAdmin = false) {
    const video = await prisma.businessVideo.findUnique({ where: { id } });
    if (!video) throw new Error("ویدیو یافت نشد.");
    if (!isAdmin && video.userId !== userId) {
      throw new Error("شما اجازه حذف این ویدیو را ندارید.");
    }

    // حذف رکورد از دیتابیس
    const deleted = await prisma.businessVideo.delete({ where: { id } });

    // پاکسازی فایل از دیسک سرور
    if (video.videoUrl && video.videoUrl.startsWith("/uploads/")) {
      const filename = path.basename(video.videoUrl);
      const filePath = path.join(uploadDirAbsolutePath, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("خطا در پاکسازی فیزیکی فایل ویدیو:", err);
        }
      }
    }

    return deleted;
  }

  /**
   * لایک / آن‌لایک با تراکنش امن
   */
  async toggleLike(videoId: string, userId: string) {
    const video = await prisma.businessVideo.findUnique({ where: { id: videoId } });
    if (!video) throw new Error("ویدیو یافت نشد.");

    const existing = await prisma.businessVideoLike.findUnique({
      where: { videoId_userId: { videoId, userId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.businessVideoLike.delete({
          where: { videoId_userId: { videoId, userId } },
        }),
        prisma.businessVideo.update({
          where: { id: videoId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
      return { liked: false };
    } else {
      await prisma.$transaction([
        prisma.businessVideoLike.create({
          data: { videoId, userId },
        }),
        prisma.businessVideo.update({
          where: { id: videoId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);
      return { liked: true };
    }
  }

  /**
   * دریافت کامنت‌ها همراه با ریپلای‌ها
   */
  async getComments(videoId: string) {
    return prisma.businessVideoComment.findMany({
      where: { videoId, parentId: null, isApproved: true },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: userSelect },
        replies: {
          where: { isApproved: true },
          include: { user: { select: userSelect } },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  /**
   * ثبت کامنت جدید
   */
  async addComment(videoId: string, userId: string, content: string, parentId?: string | null) {
    const video = await prisma.businessVideo.findUnique({ where: { id: videoId } });
    if (!video) throw new Error("ویدیو یافت نشد.");

    if (parentId) {
      const parent = await prisma.businessVideoComment.findUnique({ where: { id: parentId } });
      if (!parent || parent.videoId !== videoId) {
        throw new Error("کامنت والد نامعتبر است.");
      }
    }

    return prisma.businessVideoComment.create({
      data: {
        videoId,
        userId,
        content,
        parentId: parentId || null,
      },
      include: {
        user: { select: userSelect },
      },
    });
  }

  /**
   * مدیریت وضعیت و اولویت در پنل ادمین
   */
  async adminUpdateStatus(
    id: string,
    status: BusinessVideoStatus,
    rejectionReason?: string | null,
    isFeatured?: boolean,
    order?: number
  ) {
    return prisma.businessVideo.update({
      where: { id },
      data: {
        status,
        rejectionReason: status === BusinessVideoStatus.REJECTED ? rejectionReason : null,
        ...(isFeatured !== undefined ? { isFeatured } : {}),
        ...(order !== undefined ? { order } : {}),
      },
    });
  }

  /**
   * لیست اختصاصی ادمین
   */
  async adminList(status?: BusinessVideoStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (status) where.status = status;

    const [items, total] = await Promise.all([
      prisma.businessVideo.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              participantProfile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      }),
      prisma.businessVideo.count({ where }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const businessShowcaseService = new BusinessShowcaseService();
