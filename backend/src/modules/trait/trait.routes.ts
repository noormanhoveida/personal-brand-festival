import { Router } from "express";
import multer from "multer";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { listAll, listForSituation, generateQuestions, questionBank, upload } from "./trait.controller";

// Excel files are parsed in-memory (never persisted to disk) — this is
// a bulk-import tool, not a document store, so there's nothing to keep
// after the rows are read into the database.
const excelUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB — enough for a few thousand rows
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("فقط فایل اکسل (.xlsx یا .xls) مجاز است."));
      return;
    }
    cb(null, true);
  },
});

const router = Router();
router.use(requireAuth);

router.get("/situation/:situationId", listForSituation); // any logged-in user — needed for the tag picker
router.get("/", requireRole(Role.ADMIN), listAll);
router.post("/upload", requireRole(Role.ADMIN), excelUpload.single("file"), upload);
router.post("/generate-questions", requireRole(Role.ADMIN), generateQuestions);
router.get("/questions", requireRole(Role.ADMIN), questionBank);

export default router;
