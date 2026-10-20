import { Request, Response } from "express";
import { NetworkGraphService } from "./network-graph.service";
import { prisma } from "../../config/db";

export class NetworkGraphController {
  static async getGlobalGraph(_req: Request, res: Response) {
    try {
      const data = await NetworkGraphService.getGlobalGraph();
      return res.json(data);
    } catch (err: any) {
      console.error("Error in getGlobalGraph:", err);
      return res.status(500).json({ error: "خطا در دریافت گراف جامع ارتباطات" });
    }
  }

  static async getMyNetworkGraph(req: any, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ error: "احراز هویت انجام نشده است." });
      }

      const participant = await prisma.participantProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (!participant) {
        return res.status(404).json({ error: "پروفایل شرکت‌کننده یافت نشد." });
      }

      const data = await NetworkGraphService.getMyNetworkGraph(participant.id);
      return res.json(data);
    } catch (err: any) {
      console.error("Error in getMyNetworkGraph:", err);
      return res.status(500).json({ error: "خطا در دریافت گراف ارتباطات کاربری" });
    }
  }
}
