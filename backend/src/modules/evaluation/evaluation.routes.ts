import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import {
  assignEvaluatorSchema,
  createEvaluationSchema,
  criterionInputSchema,
  criterionUpdateSchema,
  saveDraftSchema,
} from "./evaluation.validator";
import {
  assignHandler,
  assignedHandler,
  createCriterionHandler,
  createHandler,
  getHandler,
  listCriteriaHandler,
  reviewBundleHandler,
  saveDraftHandler,
  submitHandler,
  updateCriterionHandler,
} from "./evaluation.controller";

const router = Router();
router.use(requireAuth);

// Criteria — weights are Admin-configurable platform settings (spec §21).
router.get("/criteria", listCriteriaHandler);
router.post(
  "/criteria",
  requireRole(Role.ADMIN),
  validateBody(criterionInputSchema),
  createCriterionHandler
);
router.put(
  "/criteria/:id",
  requireRole(Role.ADMIN),
  validateBody(criterionUpdateSchema),
  updateCriterionHandler
);

// Assignment — Admin decides which evaluator reviews which participant.
router.post(
  "/assignments",
  requireRole(Role.ADMIN),
  validateBody(assignEvaluatorSchema),
  assignHandler
);
router.get("/assigned", requireRole(Role.EVALUATOR, Role.ADMIN), assignedHandler);

// Evaluator's single-page review bundle for one participant (spec §28).
router.get(
  "/review/:participantId",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  reviewBundleHandler
);

// Evaluation lifecycle: open draft -> save draft (repeatable) -> submit (locks it).
router.post(
  "/",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  validateBody(createEvaluationSchema),
  createHandler
);
router.get("/:id", getHandler); // access-controlled inside the service
router.put(
  "/:id",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  validateBody(saveDraftSchema),
  saveDraftHandler
);
router.post(
  "/:id/submit",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  submitHandler
);

export default router;
