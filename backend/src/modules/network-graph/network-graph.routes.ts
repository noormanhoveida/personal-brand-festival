import { Router } from "express";
import { NetworkGraphController } from "./network-graph.controller";
import { requireAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/global", NetworkGraphController.getGlobalGraph);
router.get("/my-network", requireAuth, NetworkGraphController.getMyNetworkGraph);

export default router;
