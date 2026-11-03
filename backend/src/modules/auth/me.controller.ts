import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getMe(req: Request, res: Response) {
  const userId = (req as any).user?.id || (req as any).user?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "احراز هویت نشده‌اید" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      participantProfile: {
        include: { media: { take: 1, orderBy: { createdAt: "desc" } } }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "کاربر یافت نشد" });
  }

  const profile = user.participantProfile;
  const fullName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "";
  const avatarUrl = profile?.media?.[0]?.url || null;

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        name: fullName || user.email || "کاربر سایت",
        avatarUrl
      }
    }
  });
}
