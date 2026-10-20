import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { challengeUpload } from "../../config/upload";
import { createChallengeSchema, submitWorkSchema, updateChallengeSchema } from "./challenge.validator";
import {
  create,
  detail,
  list,
  mySubmission,
  remove,
  sendToInstructor,
  submissions,
  submit,
  update,
  uploadAttachment,
} from "./challenge.controller";

const router = Router();

// requireAuth is applied per-route (not via router.use) — see the
// comment in task.routes.ts for why. Never reintroduce a blanket
// router.use(requireAuth) here.

const canManage = requireRole(Role.BOOTCAMP_MANAGER, Role.ADMIN);
const canReview = requireRole(Role.EVALUATOR, Role.BOOTCAMP_MANAGER, Role.ADMIN);

router.get("/challenges", requireAuth, list);
router.get("/challenges/:challengeId", requireAuth, detail);
router.post("/challenges", requireAuth, canManage, validateBody(createChallengeSchema), create);
router.patch(
  "/challenges/:challengeId",
  requireAuth,
  canManage,
  validateBody(updateChallengeSchema),
  update
);
router.delete("/challenges/:challengeId", requireAuth, canManage, remove);

// Participant's own submission (upsert — one per challenge).
router.get("/challenges/:challengeId/submission/mine", requireAuth, mySubmission);
router.post(
  "/challenges/:challengeId/submission",
  requireAuth,
  validateBody(submitWorkSchema),
  submit
);
router.post(
  "/challenges/:challengeId/submission/upload",
  requireAuth,
  challengeUpload.single("file"),
  uploadAttachment
);

// Evaluator/manager/admin review queue.
router.get("/challenges/:challengeId/submissions", requireAuth, canReview, submissions);
router.post(
  "/challenge-submissions/:submissionId/send-to-instructor",
  requireAuth,
  canReview,
  sendToInstructor
);

export default router;
