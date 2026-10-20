import { Request, Response } from "express";
import { artifactService } from "./artifact.service";

export class ArtifactController {
  async getGuide(req: Request, res: Response) {
    try {
      const guide = await artifactService.getGuide();
      return res.json(guide);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت راهنما" });
    }
  }

  async updateGuide(req: Request, res: Response) {
    try {
      const updated = await artifactService.updateGuide(req.body);
      return res.json(updated);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در به روزرسانی راهنما" });
    }
  }

  async getPublicBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;
      const data = await artifactService.getPublicArtifactsBySlug(slug);
      return res.json(data);
    } catch (e: any) {
      return res.status(404).json({ message: e.message || "پروفایل یافت نشد" });
    }
  }

  async getComments(req: Request, res: Response) {
    try {
      const artifactId = req.params.id;
      const comments = await artifactService.getCommentsByArtifactId(artifactId);
      return res.json(comments);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت نظرات" });
    }
  }

  async postComment(req: any, res: Response) {
    try {
      const artifactId = req.params.id;
      const { content, parentId } = req.body;
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
      if (!content?.trim()) return res.status(400).json({ message: "متن نظر نمی‌تواند خالی باشد" });
      const comment = await artifactService.addComment(userId, artifactId, content, parentId);
      return res.json(comment);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در ثبت نظر" });
    }
  }

  async reactComment(req: any, res: Response) {
    try {
      const { commentId } = req.params;
      const { action } = req.body;
      const userId = req.user?.id || req.user?.userId;
      if (!userId) return res.status(401).json({ message: "لطفاً ابتدا وارد شوید" });
      const updated = await artifactService.reactToComment(commentId, userId, action);
      return res.json(updated);
    } catch (e: any) {
      return res.status(400).json({ message: e.message || "خطا در ثبت واکنش" });
    }
  }

  async listApproved(req: Request, res: Response) {
    try {
      const take = Number(req.query.take) || 12;
      const result = await artifactService.getApprovedArtifacts(take);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت لیست آثار تایید شده" });
    }
  }

  async getMyArtifacts(req: any, res: Response) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await artifactService.getMyArtifacts(userId);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت آثار کاربر" });
    }
  }

  async create(req: any, res: Response) {
    try {
      const userId = req.user?.id || req.user?.userId;
      const result = await artifactService.createArtifact(userId, req.body);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message || "خطا در ثبت اثر" });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = await artifactService.getArtifactById(id);
      if (!result) return res.status(404).json({ message: "اثر یافت نشد" });
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت اثر" });
    }
  }

  async delete(req: any, res: Response) {
    try {
      const artifactId = req.params.id;
      const userId = req.user?.id || req.user?.userId;
      const isAdmin = req.user?.role === "ADMIN";
      const result = await artifactService.deleteArtifact(userId, artifactId, isAdmin);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message || "خطا در حذف اثر" });
    }
  }

  async rate(req: any, res: Response) {
    try {
      const artifactId = req.params.id;
      const { score } = req.body;
      const userId = req.user?.id || req.user?.userId;
      const result = await artifactService.rateArtifact(userId, artifactId, Number(score));
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message || "خطا در ثبت امتیاز" });
    }
  }

  async adminList(req: Request, res: Response) {
    try {
      const status = req.query.status as string | undefined;
      const result = await artifactService.getAdminArtifacts(status);
      return res.json(result);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || "خطا در دریافت لیست آثار ادمین" });
    }
  }

  async adminReview(req: Request, res: Response) {
    try {
      const artifactId = req.params.id;
      const { status, adminNote } = req.body;
      const result = await artifactService.reviewArtifact(artifactId, status, adminNote);
      return res.json(result);
    } catch (e: any) {
      return res.status(400).json({ message: e.message || "خطا در بررسی اثر" });
    }
  }

  async editComment(req: any, res: Response) {
    try {
      const { commentId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id || req.user?.userId;
      if (!content || !content.trim()) return res.status(400).json({ message: "متن نظر نمی‌تواند خالی باشد" });
      const updated = await artifactService.editComment(commentId, userId, content.trim());
      return res.json(updated);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "خطا در ویرایش دیدگاه" });
    }
  }

  async deleteComment(req: any, res: Response) {
    try {
      const { commentId } = req.params;
      const userId = req.user?.id || req.user?.userId;
      const userRole = req.user?.role;
      await artifactService.deleteComment(commentId, userId, userRole);
      return res.json({ success: true, message: "دیدگاه با موفقیت حذف شد" });
    } catch (err: any) {
      return res.status(400).json({ message: err.message || "خطا در حذف دیدگاه" });
    }
  }

}
export const artifactController = new ArtifactController();
