import { Router } from "express";
import { getTickets, updateTicketStatus, getNextTicket, getTicket, getTicketByNumber } from "./controller.js";
const router = Router();

router.get("/", getTickets);
router.post("/", getTicket);
router.post("/number", getTicketByNumber);
router.put("/:id", updateTicketStatus);
router.get("/next", getNextTicket);
export default router;
