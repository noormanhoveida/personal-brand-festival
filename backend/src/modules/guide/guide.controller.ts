import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizePath(rawPath: string): string {
  if (!rawPath) return "/";
  let clean = rawPath.split("?")[0].split("#")[0].trim();
  if (!clean.startsWith("/")) clean = "/" + clean;
  if (clean.length > 1 && clean.endsWith("/")) clean = clean.slice(0, -1);
  return clean;
}

export const getGuideByPath = async (req: Request, res: Response) => {
  try {
    const rawPath = (req.query.path as string) || "/";
    const pagePath = normalizePath(rawPath);

    const guide = await prisma.guide.findUnique({
      where: { pagePath },
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!guide || !guide.isEnabled || guide.slides.length === 0) {
      return res.json({ success: true, data: null });
    }

    return res.json({ success: true, data: guide });
  } catch (error) {
    console.error("Error fetching guide:", error);
    return res.status(500).json({ success: false, message: "خطا در دریافت راهنما" });
  }
};

export const listAllGuides = async (_req: Request, res: Response) => {
  try {
    const guides = await prisma.guide.findMany({
      include: {
        slides: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return res.json({ success: true, data: guides });
  } catch (error) {
    return res.status(500).json({ success: false, message: "خطا در دریافت لیست راهنماها" });
  }
};

export const upsertGuide = async (req: Request, res: Response) => {
  try {
    const { pagePath, title, isEnabled } = req.body;
    if (!pagePath) {
      return res.status(400).json({ success: false, message: "مسیر صفحه (pagePath) الزامی است" });
    }

    const cleanPath = normalizePath(pagePath);
    const guide = await prisma.guide.upsert({
      where: { pagePath: cleanPath },
      create: {
        pagePath: cleanPath,
        title: title || null,
        isEnabled: isEnabled !== undefined ? isEnabled : true,
      },
      update: {
        title: title !== undefined ? title : undefined,
        isEnabled: isEnabled !== undefined ? isEnabled : undefined,
      },
      include: { slides: { orderBy: { order: "asc" } } },
    });

    return res.json({ success: true, data: guide });
  } catch (error) {
    return res.status(500).json({ success: false, message: "خطا در ذخیره راهنما" });
  }
};

export const addSlide = async (req: Request, res: Response) => {
  try {
    const { guideId } = req.params;
    const { title, description, order } = req.body;

    let imageUrl: string | null = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    const slideCount = await prisma.guideSlide.count({ where: { guideId } });

    const slide = await prisma.guideSlide.create({
      data: {
        guideId,
        title: title || "",
        description: description || "",
        imageUrl,
        order: order !== undefined ? parseInt(order, 10) : slideCount,
      },
    });

    return res.json({ success: true, data: slide });
  } catch (error) {
    console.error("Error adding slide:", error);
    return res.status(500).json({ success: false, message: "خطا در افزودن اسلاید" });
  }
};

export const updateSlide = async (req: Request, res: Response) => {
  try {
    const { slideId } = req.params;
    const { title, description, order } = req.body;

    let imageUrl: string | undefined = undefined;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl !== undefined) {
      imageUrl = req.body.imageUrl;
    }

    const updated = await prisma.guideSlide.update({
      where: { id: slideId },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        order: order !== undefined ? parseInt(order, 10) : undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: "خطا در ویرایش اسلاید" });
  }
};

export const deleteSlide = async (req: Request, res: Response) => {
  try {
    const { slideId } = req.params;
    await prisma.guideSlide.delete({ where: { id: slideId } });
    return res.json({ success: true, message: "اسلاید با موفقیت حذف شد" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "خطا در حذف اسلاید" });
  }
};

export const deleteGuide = async (req: Request, res: Response) => {
  try {
    const { guideId } = req.params;
    await prisma.guide.delete({ where: { id: guideId } });
    return res.json({ success: true, message: "راهنما حذف شد" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "خطا در حذف راهنما" });
  }
};
