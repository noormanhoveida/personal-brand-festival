import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

function extractReceiptUrl(notes: unknown): string | null {
  if (!notes || typeof notes !== "string") return null;
  const m1 = notes.match(/\[\s*لینک\s+رسید\s+پرداخت\s*:\s*(https?:\/\/[^\]\s]+)\s*\]/i);
  if (m1?.[1]) return m1[1];
  const m2 = notes.match(/(https?:\/\/[^\s]+\/uploads\/[^\s]+)/i);
  if (m2?.[1]) return m2[1];
  return null;
}

router.get("/public/find", async (req: Request, res: Response) => {
  try {
    const email = String(req.query.email || "").trim();
    const bootcampId = String(req.query.bootcampId || "").trim();
    if (!email || !bootcampId) {
      return res.status(400).json({ success: false, message: "ایمیل یا شناسه بوت‌کمپ نامعتبر است." });
    }
    const reg = await prisma.bootcampRegistration.findFirst({
      where: {
        email: { equals: email, mode: "insensitive" as any },
        bootcampId,
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({ success: true, data: reg });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e?.message || "خطا" });
  }
});

router.patch("/public/:code/payment", async (req: Request, res: Response) => {
  try {
    const code = String(req.params.code || "").trim();
    if (!code) {
      return res.status(400).json({ success: false, message: "کد رهگیری نامعتبر است." });
    }
    const cardLastDigits = req.body?.cardLastDigits ? String(req.body.cardLastDigits).trim() : undefined;
    const receiptUrl = req.body?.receiptUrl ? String(req.body.receiptUrl).trim() : undefined;
    const note = req.body?.note ? String(req.body.note).trim() : undefined;

    const reg = await prisma.bootcampRegistration.findUnique({
      where: { trackingCode: code },
    });

    if (!reg) {
      return res.status(404).json({ success: false, message: "ثبت‌نامی با این کد رهگیری یافت نشد." });
    }

    let notes = reg.notes ?? "";
    if (note) {
      notes = notes ? `${notes}\n${note}` : note;
    }
    if (receiptUrl) {
      const tag = `[لینک رسید پرداخت: ${receiptUrl}]`;
      if (!notes.includes(receiptUrl) && !notes.includes(tag)) {
        notes = notes ? `${notes}\n${tag}` : tag;
      }
    }

    const updated = await prisma.bootcampRegistration.update({
      where: { trackingCode: code },
      data: {
        cardLastDigits: cardLastDigits || reg.cardLastDigits,
        notes: notes || null,
      },
    });

    return res.json({
      success: true,
      data: updated,
      receiptUrl: extractReceiptUrl(updated.notes),
    });
  } catch (e: any) {
    return res.status(400).json({ success: false, message: e?.message || "خطا" });
  }
});

export default router;
