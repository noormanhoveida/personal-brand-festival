import { Request, Response } from "express";
import { getAllTemplates, updateTemplate, sendDailyChatDigest } from "./email-template.service";

export async function listTemplates(req: Request, res: Response) {
  try {
    const list = await getAllTemplates();
    return res.json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function saveTemplate(req: Request, res: Response) {
  try {
    const { key } = req.params;
    const { subject, body, isActive } = req.body;
    const updated = await updateTemplate(key, { subject, body, isActive });
    return res.json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

export async function triggerChatDigest(req: Request, res: Response) {
  try {
    const result = await sendDailyChatDigest();
    return res.json({ success: true, message: "خلاصه ایمیل‌ها با موفقیت بررسی و ارسال شد", result });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
