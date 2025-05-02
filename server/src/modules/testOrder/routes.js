import express from "express";
import {
  completeTestOrder,
  createTestOrder,
  getAllTestOrders,
  getTestOrderById,
  updateTestOrder,
} from "./testOrder.controller.js";
import { uploadFiles } from "../../middlewares/upload.unified.js";

const router = express.Router();

router.post("/", uploadFiles, createTestOrder);
router.get("/", getAllTestOrders);
router.get("/:id", getTestOrderById);
router.put("/:id", uploadFiles, updateTestOrder);
router.patch("/:id/complete", completeTestOrder);

export default router;
