import Medication from "../../db/models/medication.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

// Create a new medication
export const createMedication = asyncHandler(async (req, res, next) => {
  const { name, price, description } = req.body;

  const medication = await Medication.create({
    name,
    price,
    description,
  });

  res.status(201).json({
    status: "success",
    message: "Medication created successfully",
    data: medication,
  });
});

// Get all medications
export const getAllMedications = asyncHandler(async (req, res) => {
  const medications = await Medication.find();

  res.status(200).json({
    status: "success",
    data: medications,
  });
});

// Get a single medication by ID
export const getMedicationById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const medication = await Medication.findById(id);
  if (!medication) {
    return next(new ApiError("Medication not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: medication,
  });
});

// Update a medication
export const updateMedication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, price, description } = req.body;

  const medication = await Medication.findByIdAndUpdate(
    id,
    { name, price, description },
    { new: true }
  );
  if (!medication) {
    return next(new ApiError("Medication not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Medication updated successfully",
    data: medication,
  });
});

// Delete a medication
export const deleteMedication = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const medication = await Medication.findByIdAndDelete(id);
  if (!medication) {
    return next(new ApiError("Medication not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Medication deleted successfully",
  });
});
