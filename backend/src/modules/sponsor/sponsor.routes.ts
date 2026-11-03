import { Router } from "express";
import { SponsorController } from "./sponsor.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { createSponsorSchema, updateSponsorSchema } from "./sponsor.validator";

const router = Router();

// روت‌های عمومی اسلایدرها و صفحه داخلی
router.get("/public", SponsorController.getPublicList);
router.get("/public/:slug", SponsorController.getPublicBySlug);
router.post("/:id/view", SponsorController.trackView);
router.post("/:id/click", SponsorController.trackClick);

// روت‌های مدیریت ادمین
router.get("/admin", requireAuth, requireRole("ADMIN" as any, "SUPERADMIN" as any), SponsorController.getAllAdmin);
router.get("/admin/:id", requireAuth, requireRole("ADMIN" as any, "SUPERADMIN" as any), SponsorController.getById);
router.post("/admin", requireAuth, requireRole("ADMIN" as any, "SUPERADMIN" as any), validateBody(createSponsorSchema), SponsorController.create);
router.put("/admin/:id", requireAuth, requireRole("ADMIN" as any, "SUPERADMIN" as any), validateBody(updateSponsorSchema), SponsorController.update);
router.delete("/admin/:id", requireAuth, requireRole("ADMIN" as any, "SUPERADMIN" as any), SponsorController.delete);

export default router;
