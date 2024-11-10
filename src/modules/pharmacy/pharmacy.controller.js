import Pharmacy from "../../db/models/pharmacy.model.js";
import Medication from "../../db/models/medication.model.js";
import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";
import ApiError from "../../utils/apiError.js";

export const addPrescription = asyncHandler(async (req, res, next) => {
  const {
    patient_id,
    patient_name,
    medications, 
    pickup_status,
    payment_status,
  } = req.body;

  const medicationIds = medications.map(med => med._id);
  const validMedications = await Medication.find({ _id: { $in: medicationIds } });

  if (validMedications.length !== medicationIds.length) {
    return next(new ApiError("Some medications are invalid", 400));
  }

  const medicationsWithDetails = medications.map(med => {
    const medication = validMedications.find(m => m._id.toString() === med._id.toString());
    return {
      medication: medication.name, 
      notes: med.notes,
    };
  });

  const total = medicationsWithDetails.reduce((total, med) => {
    const medication = validMedications.find(m => m.name === med.medication);
    return total + medication.price;
  }, 0);

  const newPrescription = await Pharmacy.create({
    patient_id,
    patient_name,
    medications: medicationsWithDetails,
    pickup_status,
    payment_status,
    total, 
  });

  res.status(201).json({
    status: "success",
    message: "Prescription added successfully",
    data: newPrescription,
  });
});


export const getAllPrescriptions = asyncHandler(async (req, res, next) => {
    const prescriptions = await Pharmacy.find()
      .populate("patient_id", "name")
      .populate("medications", "name price");
  
    res.status(200).json({
      status: "success",
      data: prescriptions,
    });
  });
  
export const getPrescription = asyncHandler(async (req, res, next) => {
    const { patient_id } = req.params;
  
    const prescription = await Pharmacy.findOne({ patient_id })
      .populate("patient_id", "name")
      .populate("medications", "name price"); 
    if (!prescription) {
      return next(new ApiError("Prescription not found", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: prescription,
    });
  });
  

export const updatePrescription = asyncHandler(async (req, res, next) => {
    const { patient_id } = req.params;
    const {
      medications,
      pickup_status,
      notes,
      payment_status,
    } = req.body;
  
    const prescription = await Pharmacy.findOne({ patient_id });
    if (!prescription) {
      return next(new ApiError("Prescription not found", 404));
    }
  
    const medicationIds = medications.map(med => med.medication);
    const validMedications = await Medication.find({ _id: { $in: medicationIds } });
    
    if (validMedications.length !== medicationIds.length) {
      return next(new ApiError("Some medications are invalid", 400));
    }
  
    const calculatedTotal = medications.reduce((total, med) => {
      const medication = validMedications.find(m => m._id.toString() === med.medication.toString());
      return total + (medication ? medication.price : 0);
    }, 0);
  
    prescription.medications = medications;
    prescription.pickup_status = pickup_status;
    prescription.notes = notes;
    prescription.payment_status = payment_status;
    prescription.total = calculatedTotal;
  
    await prescription.save();
  
    res.status(200).json({
      status: "success",
      message: "Prescription updated successfully",
      data: prescription,
    });
  });
  

export const deletePrescription = asyncHandler(async (req, res, next) => {
    const { patient_id } = req.params;
  
    const prescription = await Pharmacy.findOneAndDelete({ patient_id });
    if (!prescription) {
      return next(new ApiError("Prescription not found", 404));
    }
  
    res.status(200).json({
      status: "success",
      message: "Prescription deleted successfully",
    });
  });
  