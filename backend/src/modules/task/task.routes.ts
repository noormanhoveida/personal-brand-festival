import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { taskInputSchema, taskSubmissionSchema } from "./task.validator";
import { create, list, mySubmissions, submit } from "./task.controller";

const router = Router();

// requireAuth is applied per-route (not via router.use) — this router
// is mounted with no URL prefix alongside several siblings, and an
// unscoped router.use(requireAuth) on a no-prefix router intercepts
// EVERY request that reaches it in the app-level middleware chain,
// not just this router's own routes (this exact bug broke /auth/login
// once already). Never reintroduce router.use(requireAuth) here.

// Nested under a bootcamp: manage that bootcamp's tasks.
router.get("/bootcamps/:bootcampId/tasks", requireAuth, list);
router.post(
  "/bootcamps/:bootcampId/tasks",
  requireAuth,
  requireRole(Role.BOOTCAMP_MANAGER, Role.ADMIN),
  validateBody(taskInputSchema),
  create
);

// Standalone: a participant submitting to / reviewing one task.
router.post("/tasks/:taskId/submissions", requireAuth, validateBody(taskSubmissionSchema), submit);
router.get("/tasks/:taskId/submissions", requireAuth, mySubmissions);

export default router;
