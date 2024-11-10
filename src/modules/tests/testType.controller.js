// controllers/testType.controller.js

import TestType from "../../db/models/testType.model.js"; 
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js"; 

// Create a new test type
export const createTestType = asyncHandler(async (req, res, next) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return next(new ApiError("Test name and price are required", 400));
  }

  const testType = await TestType.create({ name, price });

  res.status(201).json({
    status: "success",
    message: "Test type created successfully",
    data: testType,
  });
});

// Get all test types
export const getAllTestTypes = asyncHandler(async (req, res) => {
  const testTypes = await TestType.find();

  res.status(200).json({
    status: "success",
    data: testTypes,
  });
});

// Get a single test type by ID
export const getTestTypeById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testType = await TestType.findById(id);
  if (!testType) {
    return next(new ApiError("Test type not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: testType,
  });
});

// Update a test type
export const updateTestType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const testType = await TestType.findByIdAndUpdate(
    id,
    { name, price },
    { new: true }
  );

  if (!testType) {
    return next(new ApiError("Test type not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Test type updated successfully",
    data: testType,
  });
});

// Delete a test type
export const deleteTestType = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testType = await TestType.findByIdAndDelete(id);
  if (!testType) {
    return next(new ApiError("Test type not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Test type deleted successfully",
  });
});
