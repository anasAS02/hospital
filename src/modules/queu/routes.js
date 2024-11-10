import { Router } from "express";
import { addPatientToQueue, getPatientQueue } from "./controller.js";

const router = Router();

router.get("/", getPatientQueue);
router.post("/add-to-queue", addPatientToQueue);

export default router;
