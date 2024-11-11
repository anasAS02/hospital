// controllers/testOrder.controller.js

import TestOrder from "../../db/models/testOrder.model.js"; 
import TestType from "../../db/models/testType.model.js"; 
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js"; 
import ApiError from "../../utils/apiError.js"; 

// Helper function to calculate the total price
const calculateTotalPrice = (tests) => {
  return tests.reduce((total, test) => total + test.test_price, 0);
};

// Create a new test order
export const createTestOrder = asyncHandler(async (req, res, next) => {
  const { patient_id, patient_name, tests } = req.body;

  if (!patient_id || !patient_name || !tests || tests.length === 0) {
    return next(new ApiError("Patient details or tests array is missing", 400));
  }

  // Fetch the test types and add their details
  const testDetails = [];
  for (const test of tests) {
    const testType = await TestType.findById(test.test);
    if (!testType) {
      return next(new ApiError(`Test type not found for test ID ${test.test}`, 404));
    }

    testDetails.push({
      test: test.test,
      test_name: testType.name,
      test_price: testType.price,
    });
  }

  // Calculate the total price for the order
  const total_price = calculateTotalPrice(testDetails);

  // Create the test order
  const newOrder = await TestOrder.create({
    patient_id,
    patient_name,
    tests: testDetails,
    total_price,
  });

  res.status(201).json({
    status: "success",
    message: "Test order created successfully",
    data: newOrder,
  });
});

// Get all test orders
export const getAllTestOrders = asyncHandler(async (req, res) => {
  const testOrders = await TestOrder.find()
    .populate("patient_id", "name") // Populate patient info
    .populate("tests.test", "name price"); // Populate test details

  res.status(200).json({
    status: "success",
    data: testOrders,
  });
});

// Get a specific test order by ID
export const getTestOrderById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const testOrder = await TestOrder.findById(id)
    .populate("patient_id", "name")
    .populate("tests.test", "name price");

  if (!testOrder) {
    return next(new ApiError("Test order not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: testOrder,
  });
});
