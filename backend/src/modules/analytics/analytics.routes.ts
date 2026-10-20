import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import {
  bootcampEffectiveness,
  criteriaBreakdown,
  identityGap,
  overview,
  regionalBreakdown,
} from "./analytics.controller";

const router = Router();

router.use(requireAuth, requireRole(Role.EVALUATOR, Role.ADMIN));

router.get("/overview", overview);
router.get("/bootcamps", bootcampEffectiveness);
router.get("/criteria", criteriaBreakdown);
router.get("/regions", regionalBreakdown);
router.get("/identity-gap", identityGap);

export default router;
