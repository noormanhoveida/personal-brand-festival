import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { AuthUserPayload } from "../types/express";

export function signAccessToken(payload: AuthUserPayload): string {
  const options: jwt.SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as jwt.SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.jwtAccessSecret, options);
}

export function verifyAccessToken(token: string): AuthUserPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AuthUserPayload;
}

/**
 * Refresh tokens are opaque random strings (not JWTs). We store only a
 * SHA-256 hash of the token in the database, so a leaked DB dump alone
 * cannot be used to impersonate a session.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function refreshTokenExpiryDate(): Date {
  const days = env.jwtRefreshExpiresInDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function issueTokenPair(userId: string, role: Role): TokenPair {
  return {
    accessToken: signAccessToken({ userId, role }),
    refreshToken: generateRefreshToken(),
  };
}
