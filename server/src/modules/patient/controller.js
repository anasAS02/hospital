import Counter from "../../db/models/counter.model.js";
import Patient from "../../db/models/patient.schema.js";
import Ticket from "../../db/models/ticket.model.js";
import Clinic from "../../db/models/clinic.model.js"; 
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

export const addPatient = asyncHandler(async (req, res, next) => {
  const { name, age, gender, phone, address, medicalCondition, national_id, clinicId } = req.body;

  if(national_id.length!== 10) {
    return next(new ApiError("يجب أن يكون رقم الهوية 10 أرقام", 422));
  }

  // Find the clinic
  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  // Create the patient record with the clinicId
  const newPatient = await Patient.create({
    name,
    age,
    gender,
    phone,
    address,
    medicalCondition,
    national_id,
    clinicId, // Link the patient to a clinic
    queueNumber: 0, // Placeholder, to be updated after ticket creation
  });

  // Increment the ticket counter for this clinic
  const counter = await Counter.findOneAndUpdate(
    { name: `${clinic.code}-ticket` }, 
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  let ticketNumber = counter.value;
  if (ticketNumber > 100) ticketNumber = 1; // Reset ticket number after 100

  const ticketCode = `${clinic.code}-${String(ticketNumber).padStart(2, '0')}`;

  // Create a new ticket for this patient
  const ticket = await Ticket.create({
    patient: newPatient._id,
    ticketNumber,
    ticketCode,
    national_id,
    clinic: clinic._id,
    queueNumber: ticketNumber, // Set queue number based on ticket number
  });

  // Update the patient record with the ticket reference and queue number
  newPatient.queueTicket = ticket._id;
  newPatient.queueNumber = ticketNumber;
  await newPatient.save();

  res.status(200).json({
    status: "success",
    message: "Patient added successfully",
    newPatient,
    ticket,
  });
});

export const getPatients = asyncHandler(async (req, res, next) => {
  const patients = await Patient.find().populate("clinicId", "name code national_id").populate("queueTicket", "ticketNumber ticketCode status queueNumber");

  res.status(200).json({ status: "success", data: patients });
});


export const updatePatient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, age, gender, phone, address, medicalCondition, clinicId, national_id } = req.body;

  // Find patient by ID
  const patient = await Patient.findById(id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  // Find clinic by ID if clinicId is provided to update
  let clinic = null;
  if (clinicId) {
    clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return next(new ApiError("Clinic not found", 404));
    }
  }

  // Update patient data
  patient.name = name || patient.name;
  patient.age = age || patient.age;
  patient.gender = gender || patient.gender;
  patient.phone = phone || patient.phone;
  patient.national_id = national_id || patient.national_id;
  patient.address = address || patient.address;
  patient.medicalCondition = medicalCondition || patient.medicalCondition;
  patient.clinicId = clinic ? clinic._id : patient.clinicId;

  // Save the updated patient data
  const updatedPatient = await patient.save();

  res.status(200).json({
    status: "success",
    message: "Patient updated successfully",
    data: updatedPatient,
  });
});

export const deletePatient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find patient by ID
  const patient = await Patient.findById(id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  // Delete associated ticket if it exists
  const ticket = await Ticket.findOneAndDelete({ patient: id });

  // Delete the patient record
  await Patient.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Patient deleted successfully",
    ticket,
  });
});