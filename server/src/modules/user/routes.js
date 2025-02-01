import { Router } from "express";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  updateUser,
  requestResetCode,
  resetPassword,
} from "./controller.js";

const router = Router();

router.get("/", getAllUsers)
      .get("/info", getUserInfo);

router.post("/add-user", addUser);

router.post("/request-reset-code", requestResetCode);
router.post("/reset-password", resetPassword);

router.route("/:id")
      .delete(deleteUser)
      .put(updateUser);

export default router;
