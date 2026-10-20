import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  jwtRefreshExpiresInDays: Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS ?? 30),

  refreshCookieName: process.env.REFRESH_COOKIE_NAME ?? "brand_festival_rt",

  storageDriver: (process.env.STORAGE_DRIVER as "local" | "s3") ?? "local",
  storageLocalPath: process.env.STORAGE_LOCAL_PATH ?? "./uploads",
  backendUrl: process.env.BACKEND_URL ?? `http://localhost:${process.env.PORT ?? 4000}`,

  smtpHost: process.env.SMTP_HOST ?? "",
  smtpPort: Number(process.env.SMTP_PORT ?? 587),
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER ?? "",
  smtpPass: process.env.SMTP_PASS ?? "",
  smtpFrom: process.env.SMTP_FROM ?? "فستیوال برند شخصی <no-reply@example.com>",

  // SMS: leave KAVENEGAR_API_KEY empty to log codes to console (dev).
  kavenegarApiKey: process.env.KAVENEGAR_API_KEY ?? "",
  kavenegarSender: process.env.KAVENEGAR_SENDER ?? "",
};
