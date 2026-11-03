import { prisma } from "../../config/db";

export class ChatService {
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        participantProfile: {
          select: {
            firstName: true,
            lastName: true,
            media: {
              select: { url: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });
    if (!user) throw new Error("کاربر پیدا نشد");
    const profile = user.participantProfile;
    return {
      id: user.id,
      name: profile
        ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || user.email || "کاربر سایت"
        : user.email || "کاربر سایت",
      avatarUrl: profile?.media?.[0]?.url || null,
      role: user.role,
    };
  }

  static async searchUsers(currentUserId: string, search?: string, page = 1) {
    const whereClause: any = { id: { not: currentUserId }, isBlocked: false };
    if (search && search.trim()) {
      const term = search.trim();
      whereClause.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { phone: { contains: term } },
        {
          participantProfile: {
            OR: [
              { firstName: { contains: term, mode: "insensitive" } },
              { lastName: { contains: term, mode: "insensitive" } },
            ],
          },
        },
      ];
    }
    const users = await prisma.user.findMany({
      where: whereClause,
      orderBy: { id: "asc" },
      skip: (page - 1) * 100,
      take: 100,
      select: {
        id: true,
        email: true,
        role: true,
        participantProfile: {
          select: {
            firstName: true,
            lastName: true,
            media: {
              select: { url: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });
    return users.map((u: any) => {
      const profile = u.participantProfile;
      const fullName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "";
      const avatarUrl = profile?.media?.[0]?.url || null;
      return {
        id: u.id,
        name: fullName || u.email || "کاربر سایت",
        avatarUrl,
        role: u.role,
      };
    });
  }

  static async getConversations(currentUserId: string) {
    const messages = await prisma.directMessage.findMany({
      where: { OR: [{ senderId: currentUserId }, { receiverId: currentUserId }] },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const otherUserIds = Array.from(
      new Set(messages.map((m: any) => (m.senderId === currentUserId ? m.receiverId : m.senderId)))
    );
    if (otherUserIds.length === 0) return [];

    const users = await prisma.user.findMany({
      where: { id: { in: otherUserIds } },
      select: {
        id: true,
        email: true,
        participantProfile: {
          select: {
            firstName: true,
            lastName: true,
            media: {
              select: { url: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    const userMap = new Map<string, any>();
    users.forEach((u: any) => {
      const profile = u.participantProfile;
      const fullName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : "";
      const avatarUrl = profile?.media?.[0]?.url || null;
      userMap.set(u.id, {
        userId: u.id,
        name: fullName || u.email || "کاربر سایت",
        avatarUrl,
      });
    });

    const conversationMap = new Map<string, any>();
    for (const msg of messages) {
      const isSender = msg.senderId === currentUserId;
      const otherId = isSender ? msg.receiverId : msg.senderId;
      const otherInfo = userMap.get(otherId) || { userId: otherId, name: "کاربر سایت", avatarUrl: null };
      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, {
          ...otherInfo,
          lastMessage: msg.content.startsWith("[sticker:") ? "🎨 [استیکر]" : msg.content,
          lastMessageAt: msg.createdAt,
          unreadCount: !isSender && !msg.isRead ? 1 : 0,
        });
      } else if (!isSender && !msg.isRead) {
        const conv = conversationMap.get(otherId);
        conv.unreadCount += 1;
      }
    }
    return Array.from(conversationMap.values());
  }

  static async getMessages(currentUserId: string, otherUserId: string) {
    await prisma.directMessage.updateMany({
      where: { senderId: otherUserId, receiverId: currentUserId, isRead: false },
      data: { isRead: true },
    });
    const latest = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return latest.reverse();
  }

  static async sendMessage(senderId: string, receiverId: string, content: string) {
    if (typeof content !== "string" || !content.trim()) throw new Error("متن پیام نمی‌تواند خالی باشد");
    if (content.length > 4000) throw new Error("پیام بیش از حد طولانی است");
    if (typeof receiverId !== "string" || !receiverId.trim()) throw new Error("مخاطب نامعتبر است");
    if (senderId === receiverId) throw new Error("امکان ارسال پیام به خودتان وجود ندارد");
    const receiver = await prisma.user.findFirst({
      where: { id: receiverId, isBlocked: false },
      select: { id: true },
    });
    if (!receiver) throw new Error("مخاطب پیدا نشد");
    if (content.startsWith("[sticker:")) {
      const allowed = new Set(["😀", "😍", "😂", "🥳", "👏", "❤️", "👍", "🔥", "🌟", "🎉", "🤝", "🙌"]);
      const match = /^\[sticker:(.+)\]$/.exec(content.trim());
      if (!match || !allowed.has(match[1])) throw new Error("استیکر نامعتبر است");
    }
    return prisma.directMessage.create({
      data: { senderId, receiverId, content: content.trim() },
    });
  }

  static async getUnreadCount(currentUserId: string) {
    return prisma.directMessage.count({
      where: { receiverId: currentUserId, isRead: false },
    });
  }

}
