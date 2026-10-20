import { Request, Response } from "express";
import { AnnouncementService } from "./announcement.service";
import { AnnouncementType } from "@prisma/client";

const service = new AnnouncementService();

export class AnnouncementController {
  async getAll(req: Request, res: Response) {
    try {
      const announcements = await service.getAnnouncements();
      return res.json(announcements);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const isAdmin = Boolean(req.user?.role === "ADMIN");
      if (!isAdmin) return res.status(403).json({ message: "Forbidden: Admins only" });

      const { title, content, type } = req.body || {};
      if (!title || !content) {
        return res.status(400).json({ message: "title و content الزامی است" });
      }

      const announcement = await service.createAnnouncement({
        title: String(title),
        content: String(content),
        type: type as AnnouncementType,
      });

      return res.json(announcement);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const isAdmin = Boolean(req.user?.role === "ADMIN");
      if (!isAdmin) return res.status(403).json({ message: "Forbidden: Admins only" });

      const id = String(req.params.id || "");
      if (!id) return res.status(400).json({ message: "id الزامی است" });

      await service.deleteAnnouncement(id);
      return res.json({ message: "Announcement deleted successfully" });
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Internal server error" });
    }
  }
}
