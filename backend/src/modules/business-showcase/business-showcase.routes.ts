import { Router } from "express";
import { Role } from "@prisma/client";
import { businessShowcaseController } from "./business-showcase.controller";
import { requireAuth, attachUserIfPresent } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { businessVideoUpload } from "../../config/upload";

const router = Router();

// روت‌های عمومی و بازدید
router.get("/public", (req, res) => businessShowcaseController.getPublicList(req, res));
router.get("/:id", attachUserIfPresent, (req, res) => businessShowcaseController.getById(req, res));
router.get("/:id/comments", (req, res) => businessShowcaseController.getComments(req, res));
router.get("/:id/likes", (req, res) => businessShowcaseController.getLikes(req, res));

// روت‌های نیازمند ورود کاربر
router.post("/upload", requireAuth, businessVideoUpload.single("video"), (req, res) =>
  businessShowcaseController.uploadVideoFile(req, res)
);
router.post("/", requireAuth, (req, res) => businessShowcaseController.create(req, res));
router.get("/user/my-videos", requireAuth, (req, res) => businessShowcaseController.getMyVideos(req, res));
router.delete("/:id", requireAuth, (req, res) => businessShowcaseController.delete(req, res));
router.post("/:id/like", requireAuth, (req, res) => businessShowcaseController.toggleLike(req, res));
router.post("/:id/comments", requireAuth, (req, res) => businessShowcaseController.addComment(req, res));

// روت‌های ادمین
router.get("/admin/list", requireAuth, requireRole(Role.ADMIN), (req, res) =>
  businessShowcaseController.adminList(req, res)
);
router.patch("/admin/:id/review", requireAuth, requireRole(Role.ADMIN), (req, res) =>
  businessShowcaseController.adminReview(req, res)
);

export default router;
