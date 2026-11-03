import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getLandingData = async (req: Request, res: Response) => {
  try {
    const setting = await prisma.landingSetting.findUnique({
      where: { key: "hero" }
    });
    if (!setting) {
      return res.json({ success: true, data: { sections: {} } });
    }
    return res.json({ success: true, data: setting.data });
  } catch (error) {
    console.error("Error fetching landing data:", error);
    return res.status(500).json({ success: false, message: "خطا در دریافت اطلاعات صفحه اصلی" });
  }
};

export const updateLandingData = async (req: Request, res: Response) => {
  try {
    const { sections } = req.body;
    const setting = await prisma.landingSetting.upsert({
      where: { key: "hero" },
      update: { data: { sections } },
      create: { key: "hero", data: { sections } }
    });
    return res.json({ success: true, data: setting.data });
  } catch (error) {
    console.error("Error updating landing data:", error);
    return res.status(500).json({ success: false, message: "خطا در ذخیره‌سازی اطلاعات صفحه اصلی" });
  }
};
