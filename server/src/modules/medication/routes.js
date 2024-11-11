import express from "express";
import {
  createMedication,
  getAllMedications,
  getMedicationById,
  updateMedication,
  deleteMedication,
} from "./medication.controller.js";

const router = express.Router();

// Route to create a new medication
router.post("/", createMedication);

// Route to get all medications
router.get("/", getAllMedications);

// Route to get a medication by ID
router.get("/:id", getMedicationById);

// Route to update a medication by ID
router.put("/:id", updateMedication);

// Route to delete a medication by ID
router.delete("/:id", deleteMedication);

export default router;
