import express from "express";
import {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "./medication.controller.js";

const router = express.Router();

router.post("/", createMedication);

router.get("/", getAllMedications);

router.get("/:id", getMedicationById);

router.put("/:id", updateMedication);

router.delete("/:id", deleteMedication);

export default router;
