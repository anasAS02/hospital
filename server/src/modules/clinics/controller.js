import Clinic from "../../db/models/clinic.model.js";
import ApiError from "../../utils/apiError.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

export const addClinic = asyncHandler(async (req, res, next) => {
  const { name, code } = req.body;


  const clinic = await Clinic.create({ name, code });

  res.status(201).json({
    status: "success",
    message: "Clinic added successfully",
    data: clinic,
  });
});

export const getAllClinics = asyncHandler(async (req, res) => {
  const clinics = await Clinic.find();
  res.status(200).json({ status: "success", data: clinics });
});

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
