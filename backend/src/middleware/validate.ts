import { NextFunction, Request, Response } from "express";
import { ZodSchema, z } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const isWrappedInBody =
      schema instanceof z.ZodObject && "body" in (schema as any).shape;

    const dataToParse = isWrappedInBody ? { body: req.body } : req.body;
    const result = schema.safeParse(dataToParse);

    if (!result.success) {
      console.warn(`[VALIDATION-ERROR] ${req.method} ${req.originalUrl}:`, {
        body: req.body,
        errors: result.error.format(),
      });
      return res.status(422).json({
        message: "داده‌های ارسالی نامعتبر است.",
        errors: result.error.flatten().fieldErrors,
        details: result.error.errors,
      });
    }

    req.body = isWrappedInBody ? (result.data as any).body : result.data;
    next();
  };
}
