import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { groupingInputSchema } from "./live-session.validator";
import {
  activeForBootcamp,
  adminLog,
  close,
  confirmGrouping,
  detail,
  groupMessages,
  myGroup,
  myGroupArchive,
  myReceivedMessages,
  presences,
  start,
} from "./live-session.controller";

const router = Router();
const canManage = requireRole(Role.BOOTCAMP_MANAGER, Role.ADMIN);

// requireAuth is applied per-route (not via router.use) — see the
// comment in task.routes.ts for why: this router is mounted with no
// URL prefix, and a blanket router.use(requireAuth) here would
// intercept every request reaching this point in app.ts, including
// ones meant for completely different routers (this broke
// /auth/login once already). Never reintroduce it.

// Manager/admin: start (or resume) today's live session for a bootcamp.
router.post("/bootcamps/:bootcampId/live-sessions", requireAuth, canManage, start);
// Any authenticated participant: find the session they should join now.
router.get("/bootcamps/:bootcampId/live-session", requireAuth, activeForBootcamp);

// Anyone authenticated can read session/presence/group state (frontend
// gates the check-in UI to participants; managers use the same reads
// for their dashboard).
router.get("/live-sessions/:sessionId", requireAuth, detail);
router.get("/live-sessions/:sessionId/presences", requireAuth, canManage, presences);
router.get("/live-sessions/:sessionId/my-group", requireAuth, myGroup);
router.get("/live-sessions/:sessionId/groups/:groupId/messages", requireAuth, groupMessages);

router.post(
  "/live-sessions/:sessionId/grouping",
  requireAuth,
  canManage,
  validateBody(groupingInputSchema),
  confirmGrouping
);
router.post("/live-sessions/:sessionId/close", requireAuth, canManage, close);

// Admin/manager full access to a session's conversations & presence log.
router.get("/live-sessions/:sessionId/admin-log", requireAuth, canManage, adminLog);

// Participant's own profile-facing views (spec §Phase 4).
router.get("/my/live-messages", requireAuth, myReceivedMessages);
router.get("/my/live-groups", requireAuth, myGroupArchive);

export default router;
