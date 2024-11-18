import { Router } from "express";
import handleFileUpload from "../../middlewares/upload.middleware.js";
import { addPatient, deletePatient, getPatients, updatePatient } from "./controller.js";

const router = Router();

router.route("/").post(handleFileUpload, addPatient).get(getPatients);
router.route("/:id").put(handleFileUpload, updatePatient).delete(deletePatient);

export default router;
