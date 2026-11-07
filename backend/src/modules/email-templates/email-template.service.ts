import { prisma } from "../../config/db";
import { sendMail } from "../../config/mailer";

export interface DefaultTemplate {
  key: string;
  title: string;
  subject: string;
  body: string;
  description: string;
  availableTags: string[];
}

export const DEFAULT_TEMPLATES: DefaultTemplate[] = [
  {
    key: "ANNOUNCEMENT",
    title: "اطلاعیه جدید سایت",
    subject: "اطلاعیه مهم جدید در جشنواره برند فردی",
    body: `<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
  <h2 style="color: #4f46e5; margin-top: 0;">سلام {نام_کاربر} عزیز،</h2>
  <p>یک اطلاعیه مهم و جدید در سامانه جشنواره برند فردی منتشر شده است که نیاز به بررسی شما دارد.</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{لینک_سایت}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      مشاهده و مطالعه اطلاعیه در سایت
    </a>
  </div>
  <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
    این یک پیام خودکار است؛ لطفاً به این ایمیل پاسخ ندهید.
  </p>
</div>`,
    description: "قلاب بازگشت کاربر به سایت هنگام ثبت اطلاعیه (بدون افشای متن کامل)",
    availableTags: ["{نام_کاربر}", "{لینک_سایت}"],
  },
  {
    key: "CHAT_DIGEST",
    title: "خلاصه پیام‌های خوانده‌نشده چت",
    subject: "شما {تعداد_پیام} پیام جدید خوانده‌نشده در چت دارید",
    body: `<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
  <h2 style="color: #0d9488; margin-top: 0;">سلام {نام_کاربر} گرامی،</h2>
  <p>شما <strong>{تعداد_پیام} پیام خوانده‌نشده</strong> از طرف <strong>{اسامی_فرستندگان}</strong> در سامانه دارید.</p>
  <p>همکاران و دوستان شما منتظر پاسخ شما هستند. برای مشاهده گفتگوها وارد سامانه شوید:</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{لینک_سایت}" style="background-color: #0d9488; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      ورود به بخش گفتگوها و پاسخ
    </a>
  </div>
  <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
    جشنواره برند فردی
  </p>
</div>`,
    description: "ایمیل تجمیعی روزانه برای ترغیب کاربران دارای پیام بی‌پاسخ",
    availableTags: ["{نام_کاربر}", "{تعداد_پیام}", "{اسامی_فرستندگان}", "{لینک_سایت}"],
  },
  {
    key: "NEW_FEEDBACK",
    title: "اعلان بازخورد ۳۶۰ درجه جدید",
    subject: "یک بازخورد جدید برای شما در جشنواره ثبت شد",
    body: `<div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; background: #ffffff;">
  <h2 style="color: #ea580c; margin-top: 0;">سلام {نام_کاربر} عزیز،</h2>
  <p><strong>{نام_فرستنده}</strong> یک بازخورد ۳۶۰ درجه جدید در مورد شایستگی‌های فردی و حرفه‌ای شما در سامانه ثبت کرد.</p>
  <p>دیدگاه دیگران ارزشمندترین ابزار برای تقویت برند فردی شماست. همین حالا گزارش و بازخورد را بررسی کنید:</p>
  <div style="text-align: center; margin: 32px 0;">
    <a href="{لینک_سایت}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      مشاهده بازخورد در سامانه
    </a>
  </div>
  <p style="font-size: 13px; color: #64748b; margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
    جشنواره برند فردی
  </p>
</div>`,
    description: "اطلاع‌رسانی فوری هنگام ثبت بازخورد جدید",
    availableTags: ["{نام_کاربر}", "{نام_فرستنده}", "{لینک_سایت}"],
  },
];

export async function ensureDefaultTemplates() {
  for (const t of DEFAULT_TEMPLATES) {
    const existing = await prisma.emailTemplate.findUnique({ where: { key: t.key } });
    if (!existing) {
      await prisma.emailTemplate.create({
        data: {
          key: t.key,
          title: t.title,
          subject: t.subject,
          body: t.body,
          isActive: true,
        },
      });
    }
  }
}

export async function getAllTemplates() {
  await ensureDefaultTemplates();
  return prisma.emailTemplate.findMany({ orderBy: { createdAt: "asc" } });
}

export async function updateTemplate(
  key: string,
  data: { subject?: string; body?: string; isActive?: boolean }
) {
  return prisma.emailTemplate.update({
    where: { key },
    data,
  });
}

function getSiteUrl(): string {
  const raw = process.env.FRONTEND_URL || "https://pbfestival.ir";
  return raw.replace(/\/+$/, "");
}

// 1. هوک ارسال اطلاعیه (قلاب برای بازگشت به سایت بدون درج متن کامل اطلاعیه)
export async function notifyNewAnnouncement(announcement: any) {
  try {
    const template = await prisma.emailTemplate.findUnique({ where: { key: "ANNOUNCEMENT" } });
    if (template && !template.isActive) return;

    const subjectTemplate = template?.subject || "اطلاعیه مهم جدید در جشنواره برند فردی";
    const bodyTemplate = template?.body || DEFAULT_TEMPLATES[0].body;

    const users = await prisma.user.findMany({
      where: { email: { not: null }, isBlocked: false },
      select: {
        id: true,
        email: true,
        participantProfile: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const siteUrl = `${getSiteUrl()}/dashboard/announcements`;

    for (const u of users) {
      if (!u.email) continue;
      const userName = u.participantProfile
        ? `${u.participantProfile.firstName || ""} ${u.participantProfile.lastName || ""}`.trim() || "شرکت‌کننده"
        : "شرکت‌کننده";

      const subject = subjectTemplate.replace(/{نام_کاربر}/g, userName).replace(/{لینک_سایت}/g, siteUrl);
      const html = bodyTemplate.replace(/{نام_کاربر}/g, userName).replace(/{لینک_سایت}/g, siteUrl);

      sendMail({ to: u.email, subject, html }).catch((err) =>
        console.error(`[email:announcement] Failed to send to ${u.email}:`, err.message)
      );
    }
  } catch (err: any) {
    console.error("[email:announcement] Error dispatching announcement emails:", err.message);
  }
}

// 2. هوک ارسال بازخورد جدید
export async function notifyNewFeedback(recipientUserId: string, authorName: string | null) {
  try {
    const template = await prisma.emailTemplate.findUnique({ where: { key: "NEW_FEEDBACK" } });
    if (template && !template.isActive) return;

    const user = await prisma.user.findUnique({
      where: { id: recipientUserId },
      select: {
        email: true,
        participantProfile: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!user || !user.email) return;

    const userName = user.participantProfile
      ? `${user.participantProfile.firstName || ""} ${user.participantProfile.lastName || ""}`.trim() || "همراه"
      : "همراه";

    const senderDisplay = authorName && authorName.trim().length > 0 ? authorName.trim() : "یک بازخورد ناشناس";
    const siteUrl = `${getSiteUrl()}/dashboard/feedback`;

    const subjectTemplate = template?.subject || "یک بازخورد جدید برای شما در جشنواره ثبت شد";
    const bodyTemplate = template?.body || DEFAULT_TEMPLATES[2].body;

    const subject = subjectTemplate
      .replace(/{نام_کاربر}/g, userName)
      .replace(/{نام_فرستنده}/g, senderDisplay)
      .replace(/{لینک_سایت}/g, siteUrl);

    const html = bodyTemplate
      .replace(/{نام_کاربر}/g, userName)
      .replace(/{نام_فرستنده}/g, senderDisplay)
      .replace(/{لینک_سایت}/g, siteUrl);

    await sendMail({ to: user.email, subject, html });
  } catch (err: any) {
    console.error("[email:feedback] Error dispatching feedback email:", err.message);
  }
}

// 3. ارسال روزانه خلاصه چت‌ها
export async function sendDailyChatDigest() {
  try {
    const template = await prisma.emailTemplate.findUnique({ where: { key: "CHAT_DIGEST" } });
    if (template && !template.isActive) {
      console.log("[chat:digest] Template is disabled. Skipping.");
      return { skipped: true };
    }

    const unreadMessages = await prisma.directMessage.findMany({
      where: { isRead: false },
      select: {
        id: true,
        receiverId: true,
        senderId: true,
      },
    });

    if (unreadMessages.length === 0) {
      return { sentCount: 0, message: "پیام خوانده‌نشده‌ای یافت نشد." };
    }

    // استخراج شناسه‌ها برای واکشی امن نام و ایمیل‌ها
    const userIds = new Set<string>();
    for (const msg of unreadMessages) {
      userIds.add(msg.receiverId);
      userIds.add(msg.senderId);
    }

    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(userIds) } },
      select: {
        id: true,
        email: true,
        participantProfile: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const userMap = new Map<string, { email: string | null; name: string }>();
    for (const u of users) {
      const name = u.participantProfile
        ? `${u.participantProfile.firstName || ""} ${u.participantProfile.lastName || ""}`.trim() || "کاربر"
        : "کاربر";
      userMap.set(u.id, { email: u.email, name });
    }

    // تجمیع پیام‌های خوانده‌نشده به ازای گیرنده
    const digestMap = new Map<string, { count: number; senderNames: Set<string> }>();
    for (const msg of unreadMessages) {
      const receiver = userMap.get(msg.receiverId);
      if (!receiver || !receiver.email) continue;

      if (!digestMap.has(msg.receiverId)) {
        digestMap.set(msg.receiverId, { count: 0, senderNames: new Set() });
      }
      const entry = digestMap.get(msg.receiverId)!;
      entry.count += 1;
      const sender = userMap.get(msg.senderId);
      entry.senderNames.add(sender?.name || "یکی از کاربران");
    }

    const subjectTemplate = template?.subject || "شما {تعداد_پیام} پیام جدید خوانده‌نشده در چت دارید";
    const bodyTemplate = template?.body || DEFAULT_TEMPLATES[1].body;
    const siteUrl = `${getSiteUrl()}/dashboard`;

    let sent = 0;
    for (const [receiverId, data] of digestMap.entries()) {
      const receiver = userMap.get(receiverId);
      if (!receiver || !receiver.email) continue;

      const sendersList = Array.from(data.senderNames).slice(0, 3).join("، ") +
        (data.senderNames.size > 3 ? " و دیگران" : "");

      const subject = subjectTemplate
        .replace(/{نام_کاربر}/g, receiver.name)
        .replace(/{تعداد_پیام}/g, String(data.count))
        .replace(/{اسامی_فرستندگان}/g, sendersList)
        .replace(/{لینک_سایت}/g, siteUrl);

      const html = bodyTemplate
        .replace(/{نام_کاربر}/g, receiver.name)
        .replace(/{تعداد_پیام}/g, String(data.count))
        .replace(/{اسامی_فرستندگان}/g, sendersList)
        .replace(/{لینک_سایت}/g, siteUrl);

      try {
        await sendMail({ to: receiver.email, subject, html });
        sent++;
      } catch (err: any) {
        console.error(`[chat:digest] Error sending to ${receiver.email}:`, err.message);
      }
    }

    console.log(`[chat:digest] Daily digest sent to ${sent} users.`);
    return { sentCount: sent };
  } catch (err: any) {
    console.error("[chat:digest] Run error:", err.message);
    return { error: err.message };
  }
}
