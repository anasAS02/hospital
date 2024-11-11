import Clinic from "../../db/models/clinic.model.js";
import User from "../../db/models/user.model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

// Add a new clinic
export const addClinic = asyncHandler(async (req, res, next) => {
  const { name, code } = req.body;


  const clinic = await Clinic.create({ name, code });

  res.status(201).json({
    status: "success",
    message: "Clinic added successfully",
    data: clinic,
  });
});

// Get all clinics
export const getAllClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find();
  res.status(200).json({ status: "success", data: clinics });
});

// Update a clinic
export const updateClinic = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, code } = req.body;

  const clinic = await Clinic.findByIdAndUpdate(
    id,
    { name, code },
    { new: true }
  );

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
