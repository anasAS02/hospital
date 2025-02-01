import { Router } from "express";
import {
  addClinic,
  getAllClinics,
  updateClinic,
  deleteClinic,
} from "./controller.js";

const router = Router();

router.get("/", getAllClinics);
router.post("/add-clinic", addClinic);
router.route("/:id").put(updateClinic).delete(deleteClinic);

export default router;
