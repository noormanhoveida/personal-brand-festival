import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { bootcampMediaUpload } from "../../config/upload";
import {
  bootcampInputSchema,
  bootcampStatusSchema,
  bootcampUpdateSchema,
  questionInputSchema,
} from "./bootcamp.validator";
import { z } from "zod";
import {
  attachQuestion,
  changeStatus,
  create,
  createQuestion,
  detail,
  list,
  update,
  uploadMedia,
} from "./bootcamp.controller";

const attachSchema = z.object({ questionId: z.string().uuid() });

const router = Router();
const canManage = requireRole(Role.BOOTCAMP_MANAGER, Role.ADMIN);

router.use(requireAuth);

// Reads: any authenticated user (participant sees their journey,
// evaluator/manager/admin see everything).
router.get("/", list);
router.get("/:id", detail);

// Writes: bootcamp manager or admin only.
router.post("/", canManage, validateBody(bootcampInputSchema), create);
router.post("/media/upload", canManage, bootcampMediaUpload.single("file"), uploadMedia);
router.put("/:id", canManage, validateBody(bootcampUpdateSchema), update);
router.patch(
  "/:id/status",
  canManage,
  validateBody(bootcampStatusSchema),
  changeStatus
);
router.post(
  "/:id/questions",
  canManage,
  validateBody(questionInputSchema),
  createQuestion
);
router.post(
  "/:id/questions/attach",
  canManage,
  validateBody(attachSchema),
  attachQuestion
);

export default router;
