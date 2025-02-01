import Clinic from "../../db/models/clinic.model.js";
import Counter from "../../db/models/counter.model.js";
import Patient from "../../db/models/patient.schema.js";
import TestOrder from "../../db/models/testOrder.model.js"; 
import TestType from "../../db/models/testType.model.js"; 
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js"; 
import ApiError from "../../utils/apiError.js"; 

const calculateTotalPrice = (tests) => {
  return tests.reduce((total, test) => total + test.test_price, 0);
};

export const createTestOrder = asyncHandler(async (req, res, next) => {
  const { patient_id, patient_name, clinicId, tests } = req.body;
  const pdfFiles = req.files;

  if (!patient_id || !patient_name || !clinicId || !tests || tests.length === 0) {
    return next(new ApiError("Patient details, clinicId, or tests array is missing", 400));
  }

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

  const total_price = calculateTotalPrice(testDetails);

  const patient = await Patient.findById(patient_id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  const counter = await Counter.findOneAndUpdate(
    { name: `${clinic.code}-ticket` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  let ticketNumber = counter.value;
  if (ticketNumber > 100) ticketNumber = 1;

  const ticketCode = `${clinic.code}-${String(ticketNumber).padStart(2, '0')}`;

  const ticket = await Ticket.create({
    patient: patient._id,
    ticketNumber,
    ticketCode,
    national_id: patient.national_id,
    clinic: clinic._id,
    queueNumber: ticketNumber,
  });

  const pdfFilesPath = pdfFiles ? pdfFiles.map((file) => file.path) : [];

  const newOrder = await TestOrder.create({
    patient_id,
    patient_name,
    tests: testDetails,
    total_price,
    status: "Pending",
    pdfFilesPath,
    ticket: ticket._id,
  });

  patient.testOrderTicket = ticket._id;
  await patient.save();

  res.status(201).json({
    status: "success",
    message: "Test order created successfully",
    data: newOrder,
    ticket,
  });
});

export const getAllTestOrders = asyncHandler(async (req, res) => {
  const testOrders = await TestOrder.find();

  const updatedTestOrders = testOrders.map(order => ({
    ...order.toObject(),  
    pdfFilesPath: order.pdfFilesPath.map(filePath => {
      return filePath.replace(/^.*(?=uploads)/, "/").replace(/\\/g, "/")
    }),
  }));

  res.status(200).json({
    status: "success",
    data: updatedTestOrders,
  });
});

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

export const updateTestOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const pdfFiles = req.files; 

  const testOrder = await TestOrder.findById(id);
  if (!testOrder) {
    return next(new ApiError("Test order not found", 404));
  }

  if (!pdfFiles || pdfFiles.length === 0) {
    return next(new ApiError("No files uploaded", 400));
  }

  if (pdfFiles && pdfFiles.length > 0) {
    const uploadedPaths = pdfFiles.map((file) => file.path); 
    if (!testOrder.pdfFilesPath) {
      testOrder.pdfFilesPath = [];
    }
    testOrder.pdfFilesPath.push(...uploadedPaths); 
  }

  await testOrder.save();

  res.status(200).json({
    status: "success",
    message: "Files uploaded and added to the test order successfully",
    data: testOrder,
  });
});

export const completeTestOrder = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const testOrder = await TestOrder.findById(id).populate('patient_id');

  if (!testOrder) {
    return next(new ApiError("Test order not found", 404));
  }

  const patient = await Patient.findById(testOrder.patient_id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  testOrder.status = "Completed";
  await testOrder.save();

  if (testOrder.pdfFilesPath && testOrder.pdfFilesPath.length > 0) {
    patient.pdfFilesPath = patient.pdfFilesPath || [];
    patient.pdfFilesPath.push(...testOrder.pdfFilesPath);
    await patient.save();
  }

  res.status(200).json({
    status: "success",
    message: "Test order status updated to Completed and patient pdf files updated",
    data: testOrder,
  });
});

