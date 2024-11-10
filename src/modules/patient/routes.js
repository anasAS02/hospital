import { Router } from "express";
import { addPatient, deletePatient, getPatients, updatePatient } from "./controller.js";

const router = Router();

router.route("/").post(addPatient).get(getPatients);
router.route("/:id").put(updatePatient).delete(deletePatient);

export default router;
