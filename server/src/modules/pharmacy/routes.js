import express from "express";
import { addPrescription, getAllPrescriptions, getPrescription, updatePrescription, deletePrescription } from "./pharmacy.controller.js";


const router = express.Router();

router.post("/", addPrescription);

router.get("/", getAllPrescriptions);

router.get("/:prescription_id", getPrescription);

router.put("/:prescription_id", updatePrescription);

router.delete("/:prescription_id", deletePrescription);

export default router;
