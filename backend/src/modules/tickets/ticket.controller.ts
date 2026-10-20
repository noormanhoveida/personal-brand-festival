import { Request, Response } from "express";
import { SenderRole } from "@prisma/client";
import { TicketService } from "./ticket.service";

// اگر پروژه‌ات یک middleware دارد که req.user را ست می‌کند، این تایپ کمک می‌کند.
type AuthedRequest = Request & {
  user?: {
    id: string;
    role?: string;
    isAdmin?: boolean;
  };
};

const service = new TicketService();

export class TicketController {
  async create(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    const { subject, message } = req.body || {};

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!subject || !message)
      return res.status(400).json({ message: "subject و message الزامی است" });

    const ticket = await service.createTicket(userId, String(subject), String(message));
    return res.json(ticket);
  }

  async myTickets(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const tickets = await service.getUserTickets(userId);
    return res.json(tickets);
  }

  async allTickets(req: AuthedRequest, res: Response) {
    const isAdmin = Boolean(req.user?.isAdmin || req.user?.role === "ADMIN");
    if (!isAdmin) return res.status(403).json({ message: "Forbidden" });

    const tickets = await service.getAllTickets();
    return res.json(tickets);
  }

  async addMessage(req: AuthedRequest, res: Response) {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const ticketId = String(req.params.ticketId || "");
    const { message } = req.body || {};

    if (!ticketId) return res.status(400).json({ message: "ticketId الزامی است" });
    if (!message) return res.status(400).json({ message: "message الزامی است" });

    const isAdmin = Boolean(req.user?.isAdmin || req.user?.role === "ADMIN");
    const senderRole = isAdmin ? SenderRole.ADMIN : SenderRole.USER;

    const msg = await service.addMessage(ticketId, userId, senderRole, String(message));
    return res.json(msg);
  }
}
