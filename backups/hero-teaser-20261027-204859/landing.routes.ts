import { Router } from "express";
import { getLandingData, updateLandingData } from "./landing.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";

const router = Router();

router.get("/", getLandingData);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN" as any, "SUPERADMIN" as any),
  updateLandingData
);
router.put(
  "/",
  requireAuth,
  requireRole("ADMIN" as any, "SUPERADMIN" as any),
  updateLandingData
);

export default router;
