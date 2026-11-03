import { Router } from "express";
import { upload as uploadMiddleware } from "../../config/upload";
import {
  getGuideByPath,
  listAllGuides,
  upsertGuide,
  addSlide,
  updateSlide,
  deleteSlide,
  deleteGuide,
} from "./guide.controller";

const router = Router();

// روت عمومی دریافت راهنمای صفحه جاری براساس مسیر
router.get("/by-path", getGuideByPath);

// روت‌های مدیریت راهنما و اسلایدها
router.get("/admin/all", listAllGuides);
router.post("/admin/guide", upsertGuide);
router.delete("/admin/guide/:guideId", deleteGuide);

router.post("/admin/guide/:guideId/slide", uploadMiddleware.single("image"), addSlide);
router.patch("/admin/slide/:slideId", uploadMiddleware.single("image"), updateSlide);
router.delete("/admin/slide/:slideId", deleteSlide);

export default router;
