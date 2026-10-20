import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { profileInputSchema, profileUpdateSchema } from "./profile.validator";
import { completeOnboarding, editProfile, getProfile } from "./profile.controller";

const router = Router();

router.use(requireAuth); // every profile route requires a logged-in user

router.get("/", getProfile);
router.post("/onboarding", validateBody(profileInputSchema), completeOnboarding);
router.put("/", validateBody(profileUpdateSchema), editProfile);

export default router;
