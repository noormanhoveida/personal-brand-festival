import { PrismaClient, TicketStatus, SenderRole } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// تنظیمات Nodemailer برای ارسال ایمیل با SMTP موجود در پروژه
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

export class TicketService {
  // ایجاد تیکت جدید توسط کاربر
  async createTicket(userId: string, subject: string, message: string) {
    const ticket = await prisma.ticket.create({
      data: {
        userId,
        subject,
        messages: {
          create: {
            senderId: userId,
            senderRole: SenderRole.USER,
            message,
          },
        },
      },
      include: { messages: true, user: true },
    });

    // ارسال ایمیل به ادمین یا ثبت لاگ
    try {
      if (process.env.ADMIN_EMAIL) {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@pbfestival.ir',
          to: process.env.ADMIN_EMAIL,
          subject: `تیکت جدید: ${subject}`,
          text: `کاربر گرامی ${ticket.user.name || ticket.user.email} تیکت جدیدی ثبت کرد:\n\n${message}`,
        });
      }
    } catch (err) {
      console.error('Email send failed:', err);
    }

    return ticket;
  }

  // دریافت تیکت‌های یک کاربر
  async getUserTickets(userId: string) {
    return prisma.ticket.findMany({
      where: { userId },
      include: { messages: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // دریافت همه تیکت‌ها (برای پنل ادمین)
  async getAllTickets() {
    return prisma.ticket.findMany({
      include: { user: true, messages: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  // افزودن پیام به تیکت (چت دوطرفه)
  async addMessage(ticketId: string, senderId: string, senderRole: SenderRole, message: string) {
    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId,
        senderRole,
        message,
      },
    });

    await prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    // اگر پیام از طرف ادمین بود، به کاربر ایمیل بفرستیم
    if (senderRole === SenderRole.ADMIN) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { user: true },
      });
      if (ticket && ticket.user.email) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@pbfestival.ir',
            to: ticket.user.email,
            subject: `پاسخ جدید به تیکت: ${ticket.subject}`,
            text: `پشتیبانی جشنواره به تیکت شما پاسخ داد:\n\n${message}`,
          });
        } catch (err) {
          console.error('Email send failed:', err);
        }
      }
    }

    return ticketMessage;
  }
}
