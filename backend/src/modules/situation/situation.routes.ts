import { Router } from "express";
import { z } from "zod";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { create, list } from "./situation.controller";

const situationInputSchema = z.object({
  key: z.string().min(1).max(60),
  title: z.string().min(1).max(120),
});

const router = Router();

router.use(requireAuth);

router.get("/", list); // any logged-in user can see the list (needed for question setup + tag pickers)
router.post("/", requireRole(Role.ADMIN), validateBody(situationInputSchema), create);

export default router;
