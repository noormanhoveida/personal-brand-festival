import { Router } from "express";
import { getDirectory, getPublic } from "./personal-page.controller";

const router = Router();

router.get("/", getDirectory);
router.get("/:slug", getPublic);

export default router;
