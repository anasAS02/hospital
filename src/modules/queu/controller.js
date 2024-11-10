import { asyncHandler } from "../../middlewares/errorHandller.middleware.js";

import PatientQueue from "../../db/models/queue.model.js";

export const addPatientToQueue = asyncHandler(async (req, res, next) => {
  const { patientId } = req.body; // Use only patientId here

  const lastEntry = await PatientQueue.findOne().sort({
    waitingNumber: -1,
  });
  const waitingNumber = lastEntry ? lastEntry.waitingNumber + 1 : 1;

  const newEntry = await PatientQueue.create({
    patient: patientId, 
    waitingNumber,
    status: "waiting",
  });

  res.status(201).json({ status: "success", data: newEntry });
});

export const getPatientQueue = asyncHandler(async (req, res, next) => {
  const queue = await PatientQueue.find({ status: "waiting" }).sort({
    waitingNumber: 1,
  });
  res.json({ status: "success", data: queue });
});

export const updateQueueStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const queueEntry = await PatientQueue.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!queueEntry) {
    return next(new ApiError("Patient not found", 404));
  }

  res.status(200).json({ status: "success", data: queueEntry });
});
