import { Request, Response, NextFunction } from "express";
import { SponsorService } from "./sponsor.service";
import { SponsorPlacement } from "@prisma/client";

export class SponsorController {
  // روت‌های عمومی کلاینت
  static async getPublicList(req: Request, res: Response, next: NextFunction) {
    try {
      const placement = req.query.placement as SponsorPlacement | undefined;
      const sponsors = await SponsorService.getActiveByPlacement(placement);
      res.json({ success: true, data: sponsors });
    } catch (err) {
      next(err);
    }
  }

  static async getPublicBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const sponsor = await SponsorService.getBySlug(slug);
      if (!sponsor || !sponsor.isActive) {
        return res.status(404).json({ success: false, message: "اسپانسر یافت نشد یا غیرفعال است" });
      }
      res.json({ success: true, data: sponsor });
    } catch (err) {
      next(err);
    }
  }

  static async trackView(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SponsorService.incrementView(id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: "اسپانسر یافت نشد" });
    }
  }

  static async trackClick(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await SponsorService.incrementClick(id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(404).json({ success: false, message: "اسپانسر یافت نشد" });
    }
  }

  // روت‌های ادمین
  static async getAllAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const placement = req.query.placement as SponsorPlacement | undefined;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const sponsors = await SponsorService.getAllAdmin({ placement, isActive });
      res.json({ success: true, data: sponsors });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const sponsor = await SponsorService.getById(id);
      if (!sponsor) {
        return res.status(404).json({ success: false, message: "اسپانسر یافت نشد" });
      }
      res.json({ success: true, data: sponsor });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await SponsorService.create(req.body);
      res.status(201).json({ success: true, data: created });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(409).json({ success: false, message: "اسلاگ تکراری است. لطفاً یک اسلاگ یکتا انتخاب کنید." });
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updated = await SponsorService.update(id, req.body);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      if (err.code === "P2002") {
        return res.status(409).json({ success: false, message: "اسلاگ تکراری است." });
      }
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await SponsorService.delete(id);
      res.json({ success: true, message: "اسپانسر با موفقیت حذف شد" });
    } catch (err) {
      next(err);
    }
  }
}
