import User from "../../db/models/user.model.js";
import Ad from "../../db/models/ad.modal.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";
import jwt from 'jsonwebtoken'

export const addAd = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const image = req.file;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
      return next(new ApiError("Authorization token is required", 401));
  }

  if(!image) {
    return next(new ApiError("Image file is required", 400));
  }
    
  const imagePath = image.cloudinaryUrl;

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(decoded.userId);
  
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return next(new ApiError("Only admins can create ads", 403));
    }

  const ad = await Ad.create({
    text,
    image: imagePath,
    createdBy: user._id
  });

  res.status(201).json({
    status: "success",
    message: "Ad created successfully",
    data: ad
  });
});

export const getActiveAds = asyncHandler(async (req, res, next) => {
  const ads = await Ad.find({ status: "active" })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: ads
  });
});

export const getAllAds = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return next(new ApiError("Authorization token is required", 401));
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return next(new ApiError("Only admins can view all ads", 403));
  }

  const ads = await Ad.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: ads
  });
});

export const updateAd = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { text, status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const image = req.file;
  
    const updateData = { text, status };
    if (image) {
      const imagePath = image.cloudinaryUrl;
      updateData.image = imagePath;
    }
  
    if (!token) {
      return next(new ApiError("Authorization token is required", 401));
    }
  
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
  
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return next(new ApiError("Only admins can update ads", 403));
    }
  
    const ad = await Ad.findByIdAndUpdate(id, updateData, { new: true });
  
    if (!ad) {
      return next(new ApiError("Ad not found", 404));
    }
  
    res.status(200).json({
      status: "success",
      message: "Ad updated successfully",
      data: ad,
    });
  });
  

export const deleteAd = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError("Authorization token is required", 401));
  }

  const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
  const user = await User.findById(decoded.userId);

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    return next(new ApiError("Only admins can delete ads", 403));
  }

  const ad = await Ad.findByIdAndDelete(id);
  if (!ad) {
    return next(new ApiError("Ad not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Ad deleted successfully"
  });
});