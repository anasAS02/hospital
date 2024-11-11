import Clinic from "../../db/models/clinic.model.js";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

// Add a new clinic
export const addClinic = asyncHandler(async (req, res, next) => {
  const { name, doctors, code } = req.body;
  // Validate doctor IDs
  const validDoctors = await User.find({
    _id: { $in: doctors },
    role: "doctor",
  });

  if (validDoctors.length !== doctors.length) {
    return next(new ApiError("Invalid doctor IDs provided", 400));
  }

  const clinic = await Clinic.create({ name, doctors, code });

  res.status(201).json({
    status: "success",
    message: "Clinic added successfully",
    data: clinic,
  });
});

// Get all clinics
export const getAllClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find().populate("doctors", "name email role");
  res.status(200).json({ status: "success", data: clinics });
});

// Update a clinic
export const updateClinic = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, doctors, code } = req.body;

  // Validate doctor IDs
  const validDoctors = await User.find({
    _id: { $in: doctors },
    role: "doctor",
  });

  if (validDoctors.length !== doctors.length) {
    return next(new ApiError("Invalid doctor IDs provided", 400));
  }

  const clinic = await Clinic.findByIdAndUpdate(
    id,
    { name, doctors, code },
    { new: true }
  ).populate("doctors", "name email role");

  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Clinic updated successfully",
    data: clinic,
  });
});

// Delete a clinic
export const deleteClinic = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const clinic = await Clinic.findByIdAndDelete(id);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Clinic deleted successfully",
  });
});
