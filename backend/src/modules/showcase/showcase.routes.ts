import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import {
  setFeaturedSchema,
  setFinalistSchema,
  setWinnerSchema,
} from "./showcase.validator";
import {
  adminShowcaseHandler,
  featuredHandler,
  finalistHandler,
  publicShowcaseHandler,
  renameCategoryHandler,
  winnerHandler,
} from "./showcase.controller";

const router = Router();

// Public listing
router.get("/", publicShowcaseHandler);

// Admin endpoints
router.get("/admin/list", requireAuth, requireRole(Role.ADMIN), adminShowcaseHandler);
router.post("/admin/category/rename", requireAuth, requireRole(Role.ADMIN), renameCategoryHandler);

router.post(
  "/:participantId/featured",
  requireAuth,
  requireRole(Role.ADMIN),
  validateBody(setFeaturedSchema),
  featuredHandler
);
router.post(
  "/:participantId/finalist",
  requireAuth,
  requireRole(Role.ADMIN),
  validateBody(setFinalistSchema),
  finalistHandler
);
router.post(
  "/:participantId/winner",
  requireAuth,
  requireRole(Role.ADMIN),
  validateBody(setWinnerSchema),
  winnerHandler
);

export default router;
