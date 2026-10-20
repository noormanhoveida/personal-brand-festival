import { Router } from "express";
import { Role } from "@prisma/client";
import { artifactController } from "./artifact.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";

const router = Router();

// عمومی
router.get("/guide", (req, res) => artifactController.getGuide(req, res));
router.put("/guide", requireAuth, requireRole(Role.ADMIN), (req, res) => artifactController.updateGuide(req, res));

router.get("/public/:slug", (req, res) => artifactController.getPublicBySlug(req, res));

// روت‌های کامنت و تعاملات عمومی
router.get("/:id/comments", (req, res) => artifactController.getComments(req, res));
router.post("/:id/comments", requireAuth, (req, res) => artifactController.postComment(req, res));
router.post("/comments/:commentId/react", requireAuth, (req, res) => artifactController.reactComment(req, res));
router.patch("/comments/:commentId", requireAuth, (req, res) => artifactController.editComment(req, res));
router.delete("/comments/:commentId", requireAuth, (req, res) => artifactController.deleteComment(req, res));

// کاربر احراز هویت شده
router.get("/approved", requireAuth, (req, res) => artifactController.listApproved(req, res));
router.get("/my", requireAuth, (req, res) => artifactController.getMyArtifacts(req, res));
router.post("/", requireAuth, (req, res) => artifactController.create(req, res));
router.get("/:id", requireAuth, (req, res) => artifactController.getById(req, res));
router.delete("/:id", requireAuth, (req, res) => artifactController.delete(req, res));
router.post("/:id/rate", requireAuth, (req, res) => artifactController.rate(req, res));

// پنل ادمین
router.get("/admin/all", requireAuth, requireRole(Role.ADMIN), (req, res) => artifactController.adminList(req, res));
router.get("/admin/list", requireAuth, requireRole(Role.ADMIN), (req, res) => artifactController.adminList(req, res));
router.patch("/admin/:id/review", requireAuth, requireRole(Role.ADMIN), (req, res) => artifactController.adminReview(req, res));
router.put("/admin/:id/review", requireAuth, requireRole(Role.ADMIN), (req, res) => artifactController.adminReview(req, res));

export default router;
