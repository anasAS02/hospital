import Patient from "../../db/models/patient.schema.js";
import TestOrder from "../../db/models/testOrder.model.js";
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

// Normalize file paths helper function
const normalizeFilePaths = (filePaths) => {
  return filePaths.map((filePath) =>
    filePath.replace(/^.*(?=uploads)/, "/").replace(/\\/g, "/")
  );
};

// Get all tickets with patient data and associated tests
export const getTickets = asyncHandler(async (req, res, next) => {
  const { status, clinic } = req.query;
  const filter = {
    ...(status && { status }),
    ...(clinic && { clinic }),
  };

  // Find tickets based on filter criteria
  const tickets = await Ticket.find(filter).populate(
    "patient",
    "name national_id age gender queueNumber pdfFilePaths"
  );

  // Normalize each ticket and fetch the patient's test order
  const normalizedTickets = await Promise.all(
    tickets.map(async (ticket) => {
      const patient = await Patient.findById(ticket.patient);
      const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

      return {
        ...ticket.toObject(),
        patient: patient
          ? {
              ...patient.toObject(),
              pdfFilesPath: patient.pdfFilesPath
                ? normalizeFilePaths(patient.pdfFilesPath)
                : [],
              tests: testOrder ? testOrder.tests : [], // Add tests to patient data
            }
          : null,
        pdfFilesPath: ticket.pdfFilesPath
          ? normalizeFilePaths(ticket.pdfFilesPath)
          : [],
      };
    })
  );

  res.status(200).json({ status: "success", tickets: normalizedTickets });
});

// Get a specific ticket by its number and clinic
export const getTicket = asyncHandler(async (req, res, next) => {
  const { number, clinic } = req.body;

  if (!clinic) {
    return next(new ApiError("Clinic ID is required", 400));
  }

  const ticket = await Ticket.where("ticketNumber", number)
    .where("clinic", clinic)
    .populate("patient", "name national_id age gender queueNumber medicalCondition phone address pdfFilePaths");

  if (!ticket || ticket.length === 0) {
    return next(new ApiError("Ticket not found or does not belong to the provided clinic", 404));
  }

  const patient = await Patient.findById(ticket[0].patient);
  const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

  const normalizedTicket = {
    ...ticket[0].toObject(),
    pdfFilesPath: ticket[0].pdfFilesPath
      ? normalizeFilePaths(ticket[0].pdfFilesPath)
      : [],
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: patient.pdfFilesPath
            ? normalizeFilePaths(patient.pdfFilesPath)
            : [],
          tests: testOrder ? testOrder.tests : [], // Add tests to patient data
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: { ticket: normalizedTicket },
  });
});

// Get a specific ticket by its number (simplified version)
export const getTicketByNumber = asyncHandler(async (req, res, next) => {
  const { number } = req.body;

  const ticket = await Ticket.where("ticketNumber", number).populate(
    "patient",
    "name national_id age gender queueNumber medicalCondition phone address pdfFilePaths"
  );

  if (!ticket || ticket.length === 0) {
    return next(new ApiError("Ticket not found or does not belong to the provided clinic", 404));
  }

  const patient = await Patient.findById(ticket[0].patient);
  const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

  const normalizedTicket = {
    ...ticket[0].toObject(),
    pdfFilesPath: ticket[0].pdfFilesPath
      ? normalizeFilePaths(ticket[0].pdfFilesPath)
      : [],
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: patient.pdfFilesPath
            ? normalizeFilePaths(patient.pdfFilesPath)
            : [],
          tests: testOrder ? testOrder.tests : [], // Add tests to patient data
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: { ticket: normalizedTicket },
  });
});

// Update the status of a ticket
export const updateTicketStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });

  if (!ticket) {
    return next(new ApiError("Ticket not found", 404));
  }

  const patient = await Patient.findById(ticket.patient);
  const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

  const normalizedTicket = {
    ...ticket.toObject(),
    pdfFilesPath: ticket.pdfFilesPath
      ? normalizeFilePaths(ticket.pdfFilesPath)
      : [],
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: patient.pdfFilesPath
            ? normalizeFilePaths(patient.pdfFilesPath)
            : [],
          tests: testOrder ? testOrder.tests : [], // Add tests to patient data
        }
      : null,
  };

  res.status(200).json({ status: "success", ticket: normalizedTicket });
});

// Get the next ticket in the queue for a clinic
export const getNextTicket = asyncHandler(async (req, res, next) => {
  const { clinic } = req.query;

  if (!clinic) {
    return next(new ApiError("Clinic ID is required", 400));
  }

  const ticket = await Ticket.findOne({ clinic, status: "waiting" }).sort({ ticketNumber: 1 });

  if (!ticket) {
    return res.status(404).json({ status: "failed", message: "لا يوجد مرضى آخرين" });
  }

  ticket.status = "in-progress";
  await ticket.save();

  const patient = await Patient.findById(ticket.patient);
  const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

  const normalizedTicket = {
    ...ticket.toObject(),
    pdfFilesPath: ticket.pdfFilesPath
      ? normalizeFilePaths(ticket.pdfFilesPath)
      : [],
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: patient.pdfFilesPath
            ? normalizeFilePaths(patient.pdfFilesPath)
            : [],
          tests: testOrder ? testOrder.tests : [], // Add tests to patient data
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: normalizedTicket,
    patientData: patient,
  });
});
