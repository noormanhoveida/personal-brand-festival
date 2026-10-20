import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { Role } from "@prisma/client";
import { validateBody } from "../../middleware/validate";
import { addVersionSchema, createResponseSchema } from "./response.validator";
import { addVersion, create, history, list, listForParticipantAdmin } from "./response.controller";

const router = Router();

router.use(requireAuth);

router.get("/admin/participant/:participantId", requireRole(Role.ADMIN), listForParticipantAdmin);
router.get("/", list);
router.get("/:id", history);
router.post("/", validateBody(createResponseSchema), create);

// PUT here means "submit a new version" — see response.service.ts.
// Old versions are never overwritten by this route.
router.put("/:id", validateBody(addVersionSchema), addVersion);

export default router;