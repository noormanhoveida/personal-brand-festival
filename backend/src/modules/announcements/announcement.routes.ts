import { Router } from "express";
import { AnnouncementController } from "./announcement.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();
const controller = new AnnouncementController();

// دریافت تمام اعلان‌ها (کاربران لاگین‌کرده یا عمومی بسته به نیاز؛ اینجا پشت authenticate می‌گذاریم)
router.get("/", authenticate, controller.getAll.bind(controller));

// ایجاد و حذف (مخصوص ادمین در کنترلر چک می‌شود)
router.post("/", authenticate, controller.create.bind(controller));
router.delete("/:id", authenticate, controller.remove.bind(controller));

export default router;
