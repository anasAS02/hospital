import Patient from "../../db/models/patient.schema.js";
import Ticket from "../../db/models/ticket.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

export const getTickets = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const tickets = await Ticket.find(filter);
  res.status(200).json({ status: "success", tickets });
});

export const getTicket = asyncHandler(async (req, res, next) => {
  const { number } = req.body;

  const ticket = await Ticket.where("ticketNumber", number).populate("patient", "name national_id age gender queueNumber");
  if (!ticket || ticket.length === 0) {
    return next(new ApiError("Ticket not found", 404));
  }


  res.status(200).json({ 
    status: "success", 
    data: { ticket: ticket[0] }
  });
});


export const updateTicketStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { status } = req.body;
  const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
  if (!ticket) {
    return next(new ApiError("Ticket not found", 404));
  }
  res.status(200).json({ status: "success", ticket });
});

export const getNextTicket = asyncHandler(async (req, res, next) => {
  const ticket = await Ticket.findOne({ status: "waiting" }).sort({ ticketNumber: 1 });

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