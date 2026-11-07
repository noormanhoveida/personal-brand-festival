import chatRoutes from "./modules/chat/chat.routes";
import bootcampRegistrationRoutes from "./modules/bootcamp-registration/bootcamp-registration.routes";
import publicUpgradeRoutes from "./modules/bootcamp-registration/public-upgrade.routes";
import sponsorRoutes from "./modules/sponsor/sponsor.routes";
import workshop360Routes from "./modules/workshop-360/workshop360.routes";
import landingRoutes from "./modules/landing/landing.routes";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./modules/auth/auth.routes";
import adminRoutes from "./modules/admin/admin.routes";
import profileRoutes from "./modules/profile/profile.routes";
import regionsRoutes from "./modules/regions/regions.routes";
import journeyRoutes from "./modules/journey/journey.routes";
import bootcampRoutes from "./modules/bootcamp/bootcamp.routes";
import responseRoutes from "./modules/response/response.routes";
import feedbackRoutes from "./modules/feedback/feedback.routes";
import evaluationRoutes from "./modules/evaluation/evaluation.routes";
import reportFusionRoutes from "./modules/reportFusion/reportFusion.routes";
import personalPageRoutes from "./modules/personal-page/personal-page.routes";
import publicPageRoutes from "./modules/personal-page/public.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import showcaseRoutes from "./modules/showcase/showcase.routes";
import businessShowcaseRoutes from "./modules/business-showcase/business-showcase.routes";
import blogRoutes from "./modules/blog/blog.routes";
import artifactRoutes from "./modules/artifact/artifact.routes";
import mediaRoutes from "./modules/media/media.routes";
import guideRoutes from "./modules/guide/guide.routes";
import taskRoutes from "./modules/task/task.routes";
import skillRoutes from "./modules/skill/skill.routes";
import situationRoutes from "./modules/situation/situation.routes";
import traitRoutes from "./modules/trait/trait.routes";
import approvalRoutes from "./modules/approval/approval.routes";
import liveSessionRoutes from "./modules/live-session/live-session.routes";
import preAssessmentRoutes from "./modules/pre-assessment/pre-assessment.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes";
import challengeRoutes from "./modules/challenge/challenge.routes";
import formRoutes from "./modules/form/form.routes";
import networkGraphRoutes from "./modules/network-graph/network-graph.routes";
import ticketRoutes from "./modules/tickets/ticket.routes";
import announcementRoutes from "./modules/announcements/announcement.routes";
import { authenticate } from "./middleware/auth.middleware";
import { uploadDirAbsolutePath } from "./config/upload";

const app = express();

app.use(
  cors({
    origin: [
      env.frontendUrl,
      "http://bare-danesh.ir",
      "https://bare-danesh.ir",
      "http://www.bare-danesh.ir",
      "https://www.bare-danesh.ir",
      "http://pbfestival.ir",
      "https://pbfestival.ir",
      "http://www.pbfestival.ir",
      "https://www.pbfestival.ir",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(uploadDirAbsolutePath));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/regions", regionsRoutes);
app.use("/api/journey", journeyRoutes);
app.use("/api/bootcamps", bootcampRoutes);
app.use("/api/bootcamp-registrations", bootcampRegistrationRoutes);
app.use("/api/bootcamp-registrations", publicUpgradeRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/evaluations", evaluationRoutes);
app.use("/api/fusion-reports", reportFusionRoutes);
app.use("/api/personal-page", personalPageRoutes);
app.use("/api/public", publicPageRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/showcase", showcaseRoutes);
app.use("/api/business-showcase", businessShowcaseRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/artifacts", artifactRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/situations", situationRoutes);
app.use("/api/traits", traitRoutes);
app.use("/api/forms", formRoutes);
app.use("/api/approval", approvalRoutes);
app.use("/api/network-graph", networkGraphRoutes);

app.use("/api", taskRoutes);
app.use("/api", liveSessionRoutes);
app.use("/api", preAssessmentRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", challengeRoutes);

app.use("/api/landing", landingRoutes);
app.use("/api/tickets", authenticate, ticketRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/sponsors", sponsorRoutes);

app.use("/api/workshop-360", workshop360Routes);
app.use(errorHandler);

export default app;
