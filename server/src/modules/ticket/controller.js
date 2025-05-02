import Patient from "../../db/models/patient.schema.js";
import TestOrder from "../../db/models/testOrder.model.js";
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

const filterValidUrls = (urls) => {
  return urls ? urls.filter(url => url) : [];
};

export const getTickets = asyncHandler(async (req, res, next) => {
  const { status, clinic } = req.query;
  const filter = {
    ...(status && { status }),
    ...(clinic && { clinic }),
  };
  const tickets = await Ticket.find(filter).populate(
    "patient",
    "name national_id age gender queueNumber pdfFilePaths hasInsurance"
  );

  const normalizedTickets = await Promise.all(
    tickets.map(async (ticket) => {
      const patient = await Patient.findById(ticket.patient);
      const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

      return {
        ...ticket.toObject(),
        patient: patient
          ? {
              ...patient.toObject(),
              pdfFilesPath: filterValidUrls(patient.pdfFilesPath),
              tests: testOrder ? testOrder.tests : [],
            }
          : null,
        pdfFilesPath: filterValidUrls(ticket.pdfFilesPath),
      };
    })
  );
  res.status(200).json({ status: "success", tickets: normalizedTickets });
});

export const getTicket = asyncHandler(async (req, res, next) => {
  const { number, clinic } = req.body;

  if (!clinic) {
    return next(new ApiError("Clinic ID is required", 400));
  }

  const ticket = await Ticket.where("ticketNumber", number)
    .where("clinic", clinic)
    .populate("patient", "name national_id age gender queueNumber medicalCondition phone address pdfFilePaths hasInsurance");

  if (!ticket || ticket.length === 0) {
    return next(new ApiError("Ticket not found or does not belong to the provided clinic", 404));
  }

  const patient = await Patient.findById(ticket[0].patient);
  const testOrder = await TestOrder.findOne({ patient_id: patient._id }).populate("tests");

  const normalizedTicket = {
    ...ticket[0].toObject(),
    pdfFilesPath: filterValidUrls(ticket[0].pdfFilesPath),
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: filterValidUrls(patient.pdfFilesPath),
          tests: testOrder ? testOrder.tests : [],
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: { ticket: normalizedTicket },
  });
});

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
    pdfFilesPath: filterValidUrls(ticket[0].pdfFilesPath),
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: filterValidUrls(patient.pdfFilesPath),
          tests: testOrder ? testOrder.tests : [],
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: { ticket: normalizedTicket },
  });
});

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
    pdfFilesPath: filterValidUrls(ticket.pdfFilesPath),
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: filterValidUrls(patient.pdfFilesPath),
          tests: testOrder ? testOrder.tests : [],
        }
      : null,
  };

  res.status(200).json({ status: "success", ticket: normalizedTicket });
});

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
    pdfFilesPath: filterValidUrls(ticket.pdfFilesPath),
    patient: patient
      ? {
          ...patient.toObject(),
          pdfFilesPath: filterValidUrls(patient.pdfFilesPath),
          tests: testOrder ? testOrder.tests : [],
        }
      : null,
  };

  res.status(200).json({
    status: "success",
    data: normalizedTicket,
    patientData: patient,
  });
});
