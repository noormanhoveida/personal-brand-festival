import { Router } from "express";
import { attachUserIfPresent, requireAuth } from "../../middleware/auth.middleware";
import { validateBody } from "../../middleware/validate";
import {
  createFeedbackRequestSchema,
  submitFeedbackBySlugSchema,
  submitFeedbackSchema,
} from "./feedback.validator";
import { createRequest, list, linkInfo, submit, submitBySlug } from "./feedback.controller";

const router = Router();

// Intentionally public: the person giving feedback (a friend, manager,
// mentor) usually does not have — and should not need — an account.
router.post(
  "/submit",
  attachUserIfPresent,
  validateBody(submitFeedbackSchema),
  submit
);

// Public — open feedback directly from a public profile page, no link
// token needed. This is what makes feedback reachable for visitors the
// participant never personally sent a link to.
router.post(
  "/by-slug/:slug",
  attachUserIfPresent,
  validateBody(submitFeedbackBySlugSchema),
  submitBySlug
);

// Public — resolves who a feedback link belongs to (name + slug).
router.get("/link-info/:token", linkInfo);

// Everything else is the participant managing their own "آینه من".
router.post("/request", requireAuth, validateBody(createFeedbackRequestSchema), createRequest);
router.get("/", requireAuth, list);

export default router;
