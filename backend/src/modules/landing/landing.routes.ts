import { Router } from "express";
import {
  getLandingData,
  updateLandingData,
  uploadHeroVideo,
  deleteHeroVideo
} from "./landing.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { heroVideoUpload } from "../../config/upload";

const router = Router();

router.get("/", getLandingData);
router.post("/", requireAuth, requireRole("ADMIN"), updateLandingData);
router.put("/", requireAuth, requireRole("ADMIN"), updateLandingData);

router.post("/hero-video", requireAuth, requireRole("ADMIN"), heroVideoUpload.single("video"), uploadHeroVideo);
router.delete("/hero-video", requireAuth, requireRole("ADMIN"), deleteHeroVideo);

export default router;
