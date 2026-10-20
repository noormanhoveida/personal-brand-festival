import { Router } from "express";
import { TicketController } from "./ticket.controller";

const router = Router();
const controller = new TicketController();

/**
 * مهم:
 * این routeها باید پشت auth middleware قرار بگیرند.
 * ما در app.ts یک middleware احراز هویت را روی کل /tickets اعمال می‌کنیم.
 */

router.post("/", controller.create.bind(controller));
router.get("/me", controller.myTickets.bind(controller));

// admin
router.get("/admin/all", controller.allTickets.bind(controller));

router.post("/:ticketId/messages", controller.addMessage.bind(controller));

export default router;
