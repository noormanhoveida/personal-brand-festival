import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { env } from "../../config/env";
import fs from "fs";
import path from "path";
import { uploadDirAbsolutePath } from "../../config/upload";

const prisma = new PrismaClient();

export async function getLandingData(req: Request, res: Response, next: NextFunction) {
  try {
    const setting = await prisma.landingSetting.findUnique({
      where: { key: "hero" }
    });
    if (!setting) {
      return res.json({ success: true, data: { sections: [], heroVideoUrl: null } });
    }
    const current = (setting.data as any) || {};
    return res.json({
      success: true,
      data: {
        sections: Array.isArray(current.sections) ? current.sections : [],
        heroVideoUrl: current.heroVideoUrl || null,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLandingData(req: Request, res: Response, next: NextFunction) {
  try {
    const { sections, heroVideoUrl } = req.body;

    const current = await prisma.landingSetting.findUnique({ where: { key: "hero" } });
    const currentData = (current?.data as any) || {};

    const updatedData: any = {
      ...currentData,
      sections: Array.isArray(sections) ? sections : (currentData.sections || []),
    };

    if (heroVideoUrl !== undefined) {
      updatedData.heroVideoUrl = heroVideoUrl;
    }

    const updated = await prisma.landingSetting.upsert({
      where: { key: "hero" },
      update: { data: updatedData },
      create: { key: "hero", data: updatedData }
    });

    return res.json({ success: true, data: updated.data });
  } catch (error) {
    console.error("Error updating landing data:", error);
    next(error);
  }
}

export async function uploadHeroVideo(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "فایل ویدیو ارسال نشده است." });
    }

    const current = await prisma.landingSetting.findUnique({ where: { key: "hero" } });
    const currentData = (current?.data as any) || {};

    // حذف ویدئوی قبلی از دیسک در صورت وجود
    if (currentData.heroVideoUrl && typeof currentData.heroVideoUrl === "string") {
      const oldFilename = path.basename(currentData.heroVideoUrl);
      const oldPath = path.join(uploadDirAbsolutePath, oldFilename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (_) {}
      }
    }

    const videoUrl = `${env.backendUrl || ""}/uploads/${req.file.filename}`;
    const updatedData = { ...currentData, heroVideoUrl: videoUrl };

    await prisma.landingSetting.upsert({
      where: { key: "hero" },
      update: { data: updatedData },
      create: { key: "hero", data: updatedData }
    });

    return res.status(200).json({ success: true, data: { heroVideoUrl: videoUrl } });
  } catch (error) {
    next(error);
  }
}

export async function deleteHeroVideo(req: Request, res: Response, next: NextFunction) {
  try {
    const current = await prisma.landingSetting.findUnique({ where: { key: "hero" } });
    const currentData = (current?.data as any) || {};

    if (currentData.heroVideoUrl && typeof currentData.heroVideoUrl === "string") {
      const oldFilename = path.basename(currentData.heroVideoUrl);
      const oldPath = path.join(uploadDirAbsolutePath, oldFilename);
      if (fs.existsSync(oldPath)) {
        try { fs.unlinkSync(oldPath); } catch (_) {}
      }
    }

    const updatedData = { ...currentData, heroVideoUrl: null };
    await prisma.landingSetting.upsert({
      where: { key: "hero" },
      update: { data: updatedData },
      create: { key: "hero", data: updatedData }
    });

    return res.status(200).json({ success: true, message: "تیزر ویدیویی حذف شد." });
  } catch (error) {
    next(error);
  }
}
