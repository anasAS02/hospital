import { Router } from "express";
import { addUser, deleteUser, getAllUsers, getUserInfo, updateUser } from "./controller.js";

const router = Router();

router.get("/", getAllUsers).get('/info', getUserInfo)
router.post("/add-user", addUser)
router.route("/:id").delete(deleteUser).put(updateUser);
export default router;
