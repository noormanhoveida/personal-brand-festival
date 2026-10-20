import nodemailer from "nodemailer";
import { env } from "./env";

const isConfigured = Boolean(env.smtpHost && env.smtpUser && env.smtpPass);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: { user: env.smtpUser, pass: env.smtpPass },
    })
  : null;

if (!isConfigured) {
  console.warn(
    "[mailer] SMTP_HOST/SMTP_USER/SMTP_PASS not set — emails will be logged to the console instead of sent. " +
      "Set them in .env for real delivery."
  );
}

/**
 * Sends an email when SMTP is configured; otherwise logs the content
 * to the console so registration/verification flows are still
 * testable locally without a real mail account. Never throws on the
 * unconfigured path — only a real SMTP failure throws.
 */
export async function sendMail(input: { to: string; subject: string; html: string; text?: string }) {
  if (!transporter) {
    console.log(`\n[mailer:DEV] --- would send to ${input.to} ---`);
    console.log(`Subject: ${input.subject}`);
    console.log(input.text ?? input.html.replace(/<[^>]+>/g, ""));
    console.log("--- end email ---\n");
    return;
  }

  await transporter.sendMail({
    from: env.smtpFrom,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });
}

export async function sendVerificationEmail(to: string, code: string) {
  await sendMail({
    to,
    subject: "کد تأیید ایمیل — فستیوال برند شخصی",
    html: `
      <div dir="rtl" style="font-family: sans-serif; text-align: right;">
        <p>سلام،</p>
        <p>کد تأیید ایمیل شما:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${code}</p>
        <p>این کد تا ۱۵ دقیقه‌ی دیگر معتبر است.</p>
      </div>
    `,
    text: `کد تأیید ایمیل شما: ${code} (تا ۱۵ دقیقه معتبر است)`,
  });
}

export async function sendPasswordResetEmail(to: string, code: string): Promise<void> {
  const subject = "بازیابی رمز عبور - فستیوال برند شخصی";
  const text = `کد بازیابی رمز عبور شما: ${code}\nاین کد به مدت ۱۵ دقیقه معتبر است.\nاگر شما این درخواست را نداده‌اید، این پیام را نادیده بگیرید.`;
  const html = `
    <div dir="rtl" style="font-family: sans-serif; line-height: 1.6; color: #333;">
      <h2>درخواست بازیابی رمز عبور</h2>
      <p>کد یک‌بار مصرف برای تنظیم مجدد رمز عبور شما:</p>
      <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: #f4f4f4; border-radius: 8px; width: fit-content;">${code}</div>
      <p style="color: #777; font-size: 13px; margin-top: 16px;">این کد تا ۱۵ دقیقه معتبر است.</p>
    </div>
  `;
  await sendMail({ to, subject, text, html });
}
