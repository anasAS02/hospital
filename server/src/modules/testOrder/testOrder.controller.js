import Clinic from "../../db/models/clinic.model.js";
import Counter from "../../db/models/counter.model.js";
import Patient from "../../db/models/patient.schema.js";
import TestOrder from "../../db/models/testOrder.model.js"; 
import TestType from "../../db/models/testType.model.js"; 
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js"; 
import ApiError from "../../utils/apiError.js"; 

// Helper function to calculate the total price
const calculateTotalPrice = (tests) => {
  return tests.reduce((total, test) => total + test.test_price, 0);
};

export const createTestOrder = asyncHandler(async (req, res, next) => {
  const { patient_id, patient_name, clinicId, tests } = req.body;

  if (!patient_id || !patient_name || !clinicId || !tests || tests.length === 0) {
    return next(new ApiError("Patient details, clinicId, or tests array is missing", 400));
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
      notes: test.notes || "", // Include notes if provided
    });
  }

  // Calculate the total price for the order
  const total_price = calculateTotalPrice(testDetails);

  // Fetch patient and clinic details for ticket creation
  const patient = await Patient.findById(patient_id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  // Increment the ticket counter for the clinic
  const counter = await Counter.findOneAndUpdate(
    { name: `${clinic.code}-ticket` }, 
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  let ticketNumber = counter.value;
  if (ticketNumber > 100) ticketNumber = 1; 

  const ticketCode = `${clinic.code}-${String(ticketNumber).padStart(2, '0')}`;

  // Create a new ticket for this test order
  const ticket = await Ticket.create({
    patient: patient._id,
    ticketNumber,
    ticketCode,
    national_id: patient.national_id,
    clinic: clinic._id,
    queueNumber: ticketNumber,
  });

  // Create the test order and associate the ticket with it
  const newOrder = await TestOrder.create({
    patient_id,
    patient_name,
    tests: testDetails,
    total_price,
    ticket: ticket._id, // Link ticket to the test order
  });

  // Update the patient record with the test order ticket reference
  patient.testOrderTicket = ticket._id;
  await patient.save();

  res.status(201).json({
    status: "success",
    message: "Test order created successfully",
    data: newOrder,
    ticket,
  });
});



// Get all test orders
export const getAllTestOrders = asyncHandler(async (req, res) => {
  const testOrders = await TestOrder.find()

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
