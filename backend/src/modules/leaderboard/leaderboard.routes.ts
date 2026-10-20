import { Router } from "express";
import { Role } from "@prisma/client";
import { requireAuth } from "../../middleware/auth.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import { validateBody } from "../../middleware/validate";
import { createBoardSchema, setEntryScoreSchema, setPublishedSchema } from "./leaderboard.validator";
import {
  createBoard,
  deleteBoard,
  forParticipant,
  list,
  listPublished,
  mySummary,
  participantsForScoring,
  publish,
  publicRanking,
  ranking,
  scoreEntry,
} from "./leaderboard.controller";

const router = Router();

// Published boards feed the public showcase — no auth needed, same as
// the rest of the showcase.
router.get("/leaderboards/published", listPublished);
router.get("/leaderboards/published/:leaderboardId/ranking", publicRanking);

// requireAuth is applied per-route below (not via router.use) — see
// the comment in task.routes.ts for why. Never reintroduce a blanket
// router.use(requireAuth) here (it would also swallow the two public
// routes above being reachable from routers mounted after this one).

router.get("/leaderboards/mine", requireAuth, mySummary);
router.get("/leaderboards/participants/:participantId", requireAuth, forParticipant);

const canManage = requireRole(Role.EVALUATOR, Role.BOOTCAMP_MANAGER, Role.ADMIN);
router.get("/leaderboards", requireAuth, canManage, list);
router.get("/leaderboards/participants", requireAuth, canManage, participantsForScoring);
router.get("/leaderboards/:leaderboardId/ranking", requireAuth, canManage, ranking);
router.post(
  "/leaderboards",
  requireAuth,
  canManage,
  validateBody(createBoardSchema),
  createBoard
);
router.delete("/leaderboards/:leaderboardId", requireAuth, canManage, deleteBoard);
router.post(
  "/leaderboards/:leaderboardId/entries",
  requireAuth,
  canManage,
  validateBody(setEntryScoreSchema),
  scoreEntry
);
router.post(
  "/leaderboards/:leaderboardId/publish",
  requireAuth,
  canManage,
  validateBody(setPublishedSchema),
  publish
);

export default router;
