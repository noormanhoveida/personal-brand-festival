import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { upload } from "../../config/upload";
import * as controller from "./bootcamp-registration.controller";

const router = Router();

// آپلود تصویر رسید پرداخت (عکس)
router.post("/public/upload-receipt", upload.single("file"), controller.uploadReceiptImage);

// عمومی: ثبت نام، استعلام قبلی، ثبت پرداخت و پیگیری با کد رهگیری
router.post("/public/register", controller.createPublicRegistration);
router.get("/public/find", controller.findPublicRegistration);
router.patch("/public/:trackingCode/payment", controller.patchPublicPayment);
router.get("/public/track/:code", controller.getPublicStatus);

router.get("/my", requireAuth, controller.getMyRegistrations);

// ادمین: مشاهده لیست و تغییر وضعیت / ثبت پیام نهایی
router.get("/admin/list", requireAuth, controller.getAdminRegistrations);
router.patch("/admin/:id/status", requireAuth, controller.patchAdminRegistration);

export default router;
