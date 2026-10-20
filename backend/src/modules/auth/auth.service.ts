
const DISPOSABLE_DOMAINS = new Set([
  "ooynib.com", "tempmail.com", "10minutemail.com", "guerrillamail.com", "mailinator.com",
  "trashmail.com", "sharklasers.com", "yopmail.com", "dispostable.com", "getairmail.com",
  "tanpony.com", "olipii.com", "temp-mail.io", "mohmal.com", "fakemailgenerator.com"
]);

export function isDisposableDomain(email: string): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1].toLowerCase().trim();
  return DISPOSABLE_DOMAINS.has(domain);
}
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/errors";
import { sendVerificationEmail, sendPasswordResetEmail } from "../../config/mailer";
import { sendVerificationSms } from "../../config/sms";
import {
  hashToken,
  issueTokenPair,
  refreshTokenExpiryDate,
  signAccessToken,
} from "../../utils/tokens";

const SALT_ROUNDS = 12;
const VERIFICATION_CODE_TTL_MINUTES = 15;

export class AuthError extends AppError {}

function generateVerificationCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** Converts Persian/Arabic digits to English and normalizes to 09xxxxxxxxx */
export function normalizePhone(input: string): string {
  let s = String(input).trim();
  const fa = "۰۱۲۳۴۵۶۷۸۹";
  const ar = "٠١٢٣٤٥٦٧٨٩";
  s = s.replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)));
  s = s.replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)));
  s = s.replace(/[^+\d]/g, "");
  s = s.replace(/^\+98/, "0").replace(/^0098/, "0").replace(/^98(?=9\d{9}$)/, "0");
  if (!/^09\d{9}$/.test(s)) {
    throw new AuthError("شماره موبایل معتبر نیست.", 400);
  }
  return s;
}

async function issueEmailVerificationCode(userId: string, email: string) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);
  await prisma.emailVerificationCode.upsert({
    where: { userId },
    update: { code, expiresAt },
    create: { userId, code, expiresAt },
  });
  await sendVerificationEmail(email, code);
}

async function issuePhoneVerificationCode(userId: string, phone: string) {
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000);
  await prisma.phoneVerificationCode.upsert({
    where: { userId },
    update: { code, expiresAt },
    create: { userId, code, expiresAt },
  });
  await sendVerificationSms(phone, code);
}

/** Registration with email (legacy path) */
export async function registerUser(email: string, password: string) {
  if (isDisposableDomain(email)) {
    throw new Error("استفاده از ایمیل‌های موقت و نامعتبر مجاز نیست. لطفاً یک ایمیل معتبر وارد کنید.");
  }
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new AuthError("این ایمیل قبلاً ثبت شده است.", 409);
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email, passwordHash, role: Role.PARTICIPANT, emailVerified: false },
  });
  await issueEmailVerificationCode(user.id, user.email!);
  return { email: user.email };
}

/** Registration with phone (SMS OTP path) */
export async function registerPhoneUser(phoneRaw: string, password: string) {
  const phone = normalizePhone(phoneRaw);
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    throw new AuthError("این شماره موبایل قبلاً ثبت شده است.", 409);
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { phone, passwordHash, role: Role.PARTICIPANT, phoneVerified: false },
  });
  await issuePhoneVerificationCode(user.id, phone);
  return { phone };
}

/** Unified login: identifier can be an email or a phone number */
export async function loginUser(identifier: string, password: string) {
  const isEmail = identifier.includes("@");
  const user = isEmail
    ? await prisma.user.findUnique({ where: { email: identifier.toLowerCase() } })
    : await prisma.user.findUnique({ where: { phone: normalizePhone(identifier) } });

  if (!user) {
    throw new AuthError("ایمیل/شماره یا رمز عبور نادرست است.", 401);
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    throw new AuthError("ایمیل/شماره یا رمز عبور نادرست است.", 401);
  }

  if (user.email && !user.emailVerified) {
    throw new AuthError(
      "ایمیل شما هنوز تأیید نشده است. لطفاً کد ارسال‌شده به ایمیلتان را وارد کنید.",
      403,
      { needsVerification: true, channel: "email", contact: user.email }
    );
  }
  if (user.phone && !user.phoneVerified) {
    throw new AuthError(
      "شماره شما هنوز تأیید نشده است. لطفاً کد پیامک‌شده را وارد کنید.",
      403,
      { needsVerification: true, channel: "phone", contact: user.phone }
    );
  }

  return issueSession(user.id, user.role);
}

export async function verifyEmail(email: string, code: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { emailVerification: true },
  });
  if (!user) throw new AuthError("کاربری با این ایمیل یافت نشد.", 404);
  if (user.emailVerified) return issueSession(user.id, user.role);
  if (!user.emailVerification) {
    throw new AuthError("کدی برای این ایمیل صادر نشده. یک کد جدید درخواست کنید.", 400);
  }
  if (user.emailVerification.expiresAt < new Date()) {
    throw new AuthError("کد منقضی شده است. یک کد جدید درخواست کنید.", 400);
  }
  if (user.emailVerification.code !== code) {
    throw new AuthError("کد وارد‌شده نادرست است.", 400);
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } }),
    prisma.emailVerificationCode.delete({ where: { userId: user.id } }),
  ]);
  return issueSession(user.id, user.role);
}

export async function verifyPhone(phoneRaw: string, code: string) {
  const phone = normalizePhone(phoneRaw);
  const user = await prisma.user.findUnique({
    where: { phone },
    include: { phoneVerification: true },
  });
  if (!user) throw new AuthError("کاربری با این شماره یافت نشد.", 404);
  if (user.phoneVerified) return issueSession(user.id, user.role);
  if (!user.phoneVerification) {
    throw new AuthError("کدی برای این شماره صادر نشده. یک کد جدید درخواست کنید.", 400);
  }
  if (user.phoneVerification.expiresAt < new Date()) {
    throw new AuthError("کد منقضی شده است. یک کد جدید درخواست کنید.", 400);
  }
  if (user.phoneVerification.code !== code) {
    throw new AuthError("کد وارد‌شده نادرست است.", 400);
  }
  await prisma.$transaction([
    prisma.user.update({ where: { id: user.id }, data: { phoneVerified: true } }),
    prisma.phoneVerificationCode.delete({ where: { userId: user.id } }),
  ]);
  return issueSession(user.id, user.role);
}

export async function resendVerificationCode(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AuthError("کاربری با این ایمیل یافت نشد.", 404);
  if (user.emailVerified) throw new AuthError("این ایمیل قبلاً تأیید شده است.", 400);
  await issueEmailVerificationCode(user.id, user.email!);
}

export async function resendPhoneVerificationCode(phoneRaw: string) {
  const phone = normalizePhone(phoneRaw);
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw new AuthError("کاربری با این شماره یافت نشد.", 404);
  if (user.phoneVerified) throw new AuthError("این شماره قبلاً تأیید شده است.", 400);
  await issuePhoneVerificationCode(user.id, phone);
}

async function issueSession(userId: string, role: Role) {
  const { accessToken, refreshToken } = issueTokenPair(userId, role);
  await prisma.refreshToken.create({
    data: { userId, tokenHash: hashToken(refreshToken), expiresAt: refreshTokenExpiryDate() },
  });
  return { accessToken, refreshToken, role };
}

export async function rotateRefreshToken(presentedToken: string) {
  const tokenHash = hashToken(presentedToken);
  const stored = await prisma.refreshToken.findFirst({
    where: { tokenHash },
    include: { user: true },
  });
  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    throw new AuthError("نشست شما منقضی شده است. دوباره وارد شوید.", 401);
  }
  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true },
  });
  const { accessToken, refreshToken } = issueTokenPair(stored.user.id, stored.user.role);
  await prisma.refreshToken.create({
    data: {
      userId: stored.user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: refreshTokenExpiryDate(),
    },
  });
  return { accessToken, refreshToken, role: stored.user.role };
}

export async function revokeRefreshToken(presentedToken: string) {
  const tokenHash = hashToken(presentedToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}

export { signAccessToken };

export async function requestPasswordReset(emailRaw: string): Promise<{ message: string }> {
  const email = emailRaw.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = hashToken(code);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetCodeHash: codeHash,
        passwordResetExpiresAt: expiresAt,
      },
    });

    try {
      await sendPasswordResetEmail(email, code);
    } catch (err) {
      console.error("[Auth] Failed to send password reset email:", err);
    }
  }

  return { message: "اگر ایمیل در سامانه ثبت شده باشد، کد بازیابی ارسال شد." };
}

export async function resetPasswordWithCode(emailRaw: string, code: string, newPassword: string): Promise<{ message: string }> {
  const email = emailRaw.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.passwordResetCodeHash || !user.passwordResetExpiresAt) {
    throw new AppError("کد بازیابی نامعتبر یا منقضی شده است.", 400);
  }

  if (user.passwordResetExpiresAt.getTime() < Date.now()) {
    throw new AppError("کد بازیابی منقضی شده است.", 400);
  }

  const incomingHash = hashToken(code.trim());
  if (incomingHash !== user.passwordResetCodeHash) {
    throw new AppError("کد بازیابی نامعتبر است.", 400);
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        passwordResetCodeHash: null,
        passwordResetExpiresAt: null,
      },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  return { message: "رمز عبور با موفقیت تغییر یافت. لطفاً با رمز جدید وارد شوید." };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("کاربر یافت نشد.", 401);
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new AppError("رمز عبور فعلی اشتباه است.", 400);
  }

  const newHash = await bcrypt.hash(newPassword, 12);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash },
    }),
    prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    }),
  ]);

  return { message: "رمز عبور با موفقیت تغییر کرد." };
}
