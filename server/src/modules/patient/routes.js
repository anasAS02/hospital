import { Router } from "express";
import { createUploadMiddleware } from "../../middlewares/upload.unified.js";
import { addPatient, deletePatient, getPatients, updatePatient } from "./controller.js";

const router = Router();
const uploadFiles = createUploadMiddleware({ fieldName: 'pdfFiles', fileType: 'all', maxFiles: 5 });

router.post("/", ...uploadFiles, addPatient);
router.get("/", getPatients);
router.put("/:id", ...uploadFiles, updatePatient);
router.delete("/:id", deletePatient);

export default router;
