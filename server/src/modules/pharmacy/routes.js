import express from "express";
import { addPrescription, getAllPrescriptions, getPrescription, updatePrescription, deletePrescription } from "./pharmacy.controller.js";


const router = express.Router();

// Route to add a prescription with medication IDs
router.post("/", addPrescription);

// Route to get all prescriptions (with populated medication details)
router.get("/", getAllPrescriptions);

// Route to get a specific prescription by patient_id (with populated medication details)
router.get("/:prescription_id", getPrescription);

// Route to update a prescription (with array of medication IDs)
router.put("/:prescription_id", updatePrescription);

// Route to delete a prescription by patient_id
router.delete("/:prescription_id", deletePrescription);

export default router;
