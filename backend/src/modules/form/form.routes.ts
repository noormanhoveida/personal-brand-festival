import { Router } from "express";
import { Role } from "@prisma/client";
import { formController } from "./form.controller";
import { requireAuth, attachUserIfPresent } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";

// میدل‌ور اختیاری احراز هویت برای کاربران مهمان یا لاگین‌شده
const optionalAuth = (req: any, res: any, next: any) => {
  requireAuth(req, res, (err: any) => {
    // حتی اگر توکن نبود اجازه عبور بده
    next();
  });
};

const router = Router();

// =======================
// مسیرهای عمومی (Public)
// =======================
router.get("/my-pending", requireAuth, formController.getPendingForms);
router.get("/public", formController.getPublicForms);
router.get("/public/:idOrSlug", formController.getPublicByIdOrSlug);
router.post("/:id/answers", attachUserIfPresent, formController.submitAnswer);

// =======================
// مسیرهای مدیریتی (Admin)
// =======================
router.get("/admin/all", requireAuth, requireRole(Role.ADMIN), formController.getAllAdmin);
router.get("/admin/:id", requireAuth, requireRole(Role.ADMIN), formController.getAdminById);
router.post("/admin", requireAuth, requireRole(Role.ADMIN), formController.create);
router.put("/admin/:id", requireAuth, requireRole(Role.ADMIN), formController.update);
router.patch("/admin/:id/status", requireAuth, requireRole(Role.ADMIN), formController.setStatus);
router.post("/admin/:id/duplicate", requireAuth, requireRole(Role.ADMIN), formController.duplicate);
router.delete("/admin/:id", requireAuth, requireRole(Role.ADMIN), formController.remove);

// مدیریت سوالات فرم
router.post("/admin/:id/questions", requireAuth, requireRole(Role.ADMIN), formController.addQuestion);
router.put("/admin/:id/questions/:questionId", requireAuth, requireRole(Role.ADMIN), formController.updateQuestion);
router.delete("/admin/:id/questions/:questionId", requireAuth, requireRole(Role.ADMIN), formController.removeQuestion);
router.post("/admin/:id/questions/reorder", requireAuth, requireRole(Role.ADMIN), formController.reorderQuestions);

// دریافت نتایج و آمار تحلیلی
router.get("/admin/:id/answers", requireAuth, requireRole(Role.ADMIN), formController.getAnswers);
router.get("/admin/:id/analytics", requireAuth, requireRole(Role.ADMIN), formController.getAnalytics);

// روت‌های سازگاری قدیمی
router.get("/", formController.getPublicForms);
router.get("/:idOrSlug", formController.getPublicByIdOrSlug);

export default router;
