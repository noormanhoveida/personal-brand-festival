import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";

/**
 * Requires a valid `Authorization: Bearer <token>` access token.
 * On success, attaches { userId, role } to req.user.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "توکن احراز هویت یافت نشد." });
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    return res.status(401).json({ message: "توکن نامعتبر یا منقضی شده است." });
  }
}

/**
 * Like requireAuth but does not fail the request when no/invalid token
 * is present — used for endpoints that behave differently for
 * authenticated vs anonymous visitors (e.g. public personal pages).
 */
export function attachUserIfPresent(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) {
    try {
      req.user = verifyAccessToken(token);
    } catch {
      // ignore invalid token for optional-auth routes
    }
  }
  next();
}
