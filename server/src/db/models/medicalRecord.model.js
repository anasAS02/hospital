import { Schema, model } from "mongoose";

const medicalRecordSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    diagnosis: {
      type: String,
      required: true,
    },
    treatment: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
