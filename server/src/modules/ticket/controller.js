import Patient from "../../db/models/patient.schema.js";
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js"; // Assuming ApiError is being used in your code

// Get all tickets for a specific clinic
export const getTickets = asyncHandler(async (req, res, next) => {
  const { status, clinic } = req.query; // Destructure clinicId from query params
  const filter = {
    ...(status && { status }), // Only add status filter if provided
    ...(clinic && { clinic }) // Add clinicId filter if provided
  };

  const tickets = await Ticket.find(filter).populate("patient", "name national_id age gender queueNumber");

  res.status(200).json({ status: "success", tickets });
});

// Get a specific ticket by ticket number


export const getTicket = asyncHandler(async (req, res, next) => {
  const { number, clinic } = req.body;

  if (!clinic) {
    return next(new ApiError("Clinic ID is required", 400));
  }



  const ticket = await Ticket.where("ticketNumber", number)
    .where("clinic", clinic) 
    .populate("patient", "name national_id age gender queueNumber medicalCondition phone address");

  if (!ticket || ticket.length === 0) {
    return next(new ApiError("Ticket not found or does not belong to the provided clinic", 404));
  }

  res.status(200).json({
    status: "success",
    data: { ticket: ticket[0] }
  });
});



// Update the status of a ticket by ticket id
export const updateTicketStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
  
  if (!ticket) {
    return next(new ApiError("Ticket not found", 404));
  }

  res.status(200).json({ status: "success", ticket });
});

// Get the next ticket for a specific clinic
export const getNextTicket = asyncHandler(async (req, res, next) => {
  const { clinic } = req.query; // Get clinicId from query params
  
  if (!clinic) {
    return next(new ApiError("Clinic ID is required", 400));
  }

  // Find the next ticket for the specific clinicId that is in "waiting" status
  const ticket = await Ticket.findOne({ clinic, status: "waiting" }).sort({ ticketNumber: 1 });

  if (!ticket) {
    return res.status(404).json({ status: 'failed', message: 'لا يوجد مرضى آخرين' });
  }

  // Update the ticket status to "in-progress"
  ticket.status = "in-progress";
  await ticket.save();

  const patient = await Patient.findById(ticket.patient);

  res.status(200).json({
    status: "success",
    data: ticket,
    patientData: patient,
  });
});
