import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";

/**
 * Restricts a route to one or more roles. Must run after requireAuth.
 * The backend is the source of truth for permissions — the frontend
 * only reflects these rules in the UI and must never be trusted alone.
 */
export function requireRole(...allowed: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "احراز هویت لازم است." });
    }
    if (!allowed.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "شما اجازه دسترسی به این بخش را ندارید." });
    }
    next();
  };
}
