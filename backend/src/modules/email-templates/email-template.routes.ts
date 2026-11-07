import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { listTemplates, saveTemplate, triggerChatDigest } from "./email-template.controller";

const router = Router();

router.use(requireAuth, requireRole(Role.ADMIN));

router.get("/", listTemplates);
router.put("/:key", saveTemplate);
router.post("/trigger-chat-digest", triggerChatDigest);

export default router;
