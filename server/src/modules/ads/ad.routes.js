import { Router } from "express";
import {
  addAd,
  getActiveAds,
  getAllAds,
  updateAd,
  deleteAd
} from "./ad.controller.js";
import { uploadImage } from "../../middlewares/upload.unified.js";

const router = Router();

router.get("/active", getActiveAds);  
router.get("/all", getAllAds);       
router.post("/", uploadImage, addAd);        

router.route("/:id")
  .put(uploadImage, updateAd)   
  .delete(deleteAd);

export default router;