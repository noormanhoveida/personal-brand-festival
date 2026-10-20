import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message, ...err.extra });
  }

  console.error(err);
  return res.status(500).json({ message: "خطای داخلی سرور رخ داد." });
}
