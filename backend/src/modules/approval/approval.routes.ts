import { Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { decideResponse, decideTask, myPoints, pending } from "./approval.controller";

const decisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  // Only meaningful (and only applied) when status is APPROVED —
  // feeds the "بیشترین امتیاز دریافتی در تکالیف" leaderboard.
  score: z.number().min(0).optional(),
});

const router = Router();
router.use(requireAuth);

router.get("/points/me", myPoints);

router.get("/pending", requireRole(Role.EVALUATOR, Role.ADMIN), pending);
router.post(
  "/responses/:versionId/decide",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  validateBody(decisionSchema),
  decideResponse
);
router.post(
  "/tasks/:submissionId/decide",
  requireRole(Role.EVALUATOR, Role.ADMIN),
  validateBody(decisionSchema),
  decideTask
);

export default router;
