// routes/testOrder.routes.js

import express from "express";
import {
  createTestOrder,
  getAllTestOrders,
  getTestOrderById,
} from "./testOrder.controller.js";

const router = express.Router();

router.route("/").post(createTestOrder).get(getAllTestOrders);
router.route("/:id").get(getTestOrderById);

export default router;
