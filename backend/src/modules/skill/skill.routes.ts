import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import { addSkillSchema, endorseByTagsSchema, endorseSkillSchema } from "./skill.validator";
import { create, endorse, endorseByTags, list, listTags, remove } from "./skill.controller";

const router = Router();

router.get("/", requireAuth, list);
router.post("/", requireAuth, validateBody(addSkillSchema), create);
router.delete("/:id", requireAuth, remove);

// Intentionally public — see skill.service.ts for why.
router.post("/:id/endorse", validateBody(endorseSkillSchema), endorse);

// Public — the global tag pool and bulk tag-endorsement used by the
// feedback form's skill picker.
router.get("/tags", listTags);
router.post("/by-slug/:slug/tags", validateBody(endorseByTagsSchema), endorseByTags);

export default router;
