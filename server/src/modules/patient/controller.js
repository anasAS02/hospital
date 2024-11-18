import Counter from "../../db/models/counter.model.js";
import Patient from "../../db/models/patient.schema.js";
import Ticket from "../../db/models/ticket.model.js";
import Clinic from "../../db/models/clinic.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

const updateFilePaths = (files) => {
  return files.map(filePath =>
    filePath.replace(/^.*(?=uploads)/, "/").replace(/\\/g, "/")
  );
};

export const addPatient = asyncHandler(async (req, res, next) => {
  const { name, age, gender, phone, address, medicalCondition, national_id, clinicId } = req.body;
  const pdfFiles = req.files;

  if (!national_id || national_id.length !== 10) {
    return next(new ApiError("يجب أن يكون رقم الهوية 10 أرقام", 422));
  }

  const clinic = await Clinic.findById(clinicId);
  if (!clinic) {
    return next(new ApiError("Clinic not found", 404));
  }

  const pdfFilesPath = pdfFiles ? pdfFiles.map((file) => file.path) : [];

  const newPatient = await Patient.create({
    name,
    age,
    gender,
    phone,
    address,
    medicalCondition,
    national_id,
    clinicId,
    queueNumber: 0,
    pdfFilesPath: pdfFilesPath.length > 0 ? pdfFilesPath : undefined,
  });

  const counter = await Counter.findOneAndUpdate(
    { name: `${clinic.code}-ticket` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  let ticketNumber = counter.value;
  if (ticketNumber > 100) ticketNumber = 1;

  const ticketCode = `${clinic.code}-${String(ticketNumber).padStart(2, "0")}`;

  const ticket = await Ticket.create({
    patient: newPatient._id,
    ticketNumber,
    ticketCode,
    national_id,
    clinic: clinic._id,
    queueNumber: ticketNumber,
    pdfFilesPath: pdfFilesPath.length > 0 ? pdfFilesPath : undefined, // Only include if files exist
  });

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
  const { clinicId } = req.query;
  const query = clinicId ? { clinicId } : {};

  const patients = await Patient.find(query)
    .populate("clinicId", "name code national_id")
    .populate("queueTicket", "ticketNumber ticketCode status queueNumber");

  const updatedPatients = patients.map((patient) => ({
    ...patient.toObject(),
    pdfFilePaths: patient.pdfFilesPath
      ? updateFilePaths(patient.pdfFilesPath)
      : [],
  }));

  res.status(200).json({ status: "success", data: updatedPatients });
});

export const updatePatient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, age, gender, phone, address, medicalCondition, clinicId, national_id, status } = req.body;
  const pdfFiles = req.files;

  const patient = await Patient.findById(id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  let clinic = null;
  if (clinicId) {
    clinic = await Clinic.findById(clinicId);
    if (!clinic) {
      return next(new ApiError("Clinic not found", 404));
    }
  }

  if (pdfFiles && pdfFiles.length > 0) {
    const uploadedPaths = pdfFiles.map((file) => file.path);
    patient.pdfFilesPath = patient.pdfFilesPath || [];
    patient.pdfFilesPath.push(...uploadedPaths);
  }

  patient.name = name || patient.name;
  patient.age = age || patient.age;
  patient.gender = gender || patient.gender;
  patient.phone = phone || patient.phone;
  patient.national_id = national_id || patient.national_id;
  patient.address = address || patient.address;
  patient.medicalCondition = medicalCondition || patient.medicalCondition;
  patient.status = status || patient.status;
  patient.clinicId = clinic ? clinic._id : patient.clinicId;

  const updatedPatient = await patient.save();

  res.status(200).json({
    status: "success",
    message: "Patient updated successfully",
    data: updatedPatient,
  });
});

export const deletePatient = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const patient = await Patient.findById(id);
  if (!patient) {
    return next(new ApiError("Patient not found", 404));
  }

  const ticket = await Ticket.findOneAndDelete({ patient: id });
  await Patient.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "Patient deleted successfully",
    ticket,
  });
});
