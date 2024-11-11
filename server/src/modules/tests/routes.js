
import express from "express";
import {
  createTestType,
  getAllTestTypes,
  getTestTypeById,
  updateTestType,
  deleteTestType,
} from "./testType.controller.js";

const router = express.Router();

router.route("/").post(createTestType).get(getAllTestTypes);
router
  .route("/:id")
  .get(getTestTypeById)
  .put(updateTestType)
  .delete(deleteTestType);

export default router;
