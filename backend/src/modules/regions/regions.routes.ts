import { Router } from "express";
import { prisma } from "../../config/db";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const regions = await prisma.region.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    res.status(200).json(regions);
  } catch (err) {
    next(err);
  }
});

export default router;
