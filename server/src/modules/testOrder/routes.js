import express from "express";
import {
  completeTestOrder,
  createTestOrder,
  getAllTestOrders,
  getTestOrderById,
  updateTestOrder,
} from "./testOrder.controller.js";
import handleFileUpload from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.route("/").post(handleFileUpload, createTestOrder).get(getAllTestOrders);
router.route("/:id").get(getTestOrderById).put(handleFileUpload, updateTestOrder);
router.patch("/:id/complete", completeTestOrder);

export default router;
