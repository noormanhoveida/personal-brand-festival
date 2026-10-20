import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { coordinatorNoteSchema, preAssessmentInputSchema } from "./pre-assessment.validator";
import {
  forParticipant,
  listAll,
  mine,
  status,
  submit,
  updateCoordinatorNote,
} from "./pre-assessment.controller";

const router = Router();

// requireAuth is applied per-route (not via router.use) — see the
// comment in task.routes.ts for why. Never reintroduce a blanket
// router.use(requireAuth) here.

// Participant's own popup: is it done yet, and what can be prefilled.
router.get("/pre-assessment/status", requireAuth, status);
router.post("/pre-assessment", requireAuth, validateBody(preAssessmentInputSchema), submit);
router.get("/pre-assessment/mine", requireAuth, mine);

// Evaluator/manager/admin read + coordinator-note edit for one participant,
// plus the admin-panel overview (who has/hasn't submitted yet).
const canReview = requireRole(Role.EVALUATOR, Role.BOOTCAMP_MANAGER, Role.ADMIN);
router.get("/pre-assessment", requireAuth, canReview, listAll);
router.get("/pre-assessment/:participantId", requireAuth, canReview, forParticipant);
router.patch(
  "/pre-assessment/:participantId/coordinator-note",
  requireAuth,
  canReview,
  validateBody(coordinatorNoteSchema),
  updateCoordinatorNote
);

export default router;
