import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { updatePersonalPageSchema } from "./personal-page.validator";
import { edit, getOwn, publish, unpublish } from "./personal-page.controller";

const router = Router();
router.use(requireAuth);

router.get("/", getOwn);
router.put("/", validateBody(updatePersonalPageSchema), edit);
router.post("/publish", publish);
router.post("/unpublish", unpublish);

export default router;
