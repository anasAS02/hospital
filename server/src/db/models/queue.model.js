import { Schema, model } from "mongoose";
const patientQueueSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    waitingNumber: {
      type: Number,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["waiting", "attended"],
      default: "waiting",
    },
  },
  { timestamps: true }
);

const PatientQueue = model("PatientQueue", patientQueueSchema);
export default PatientQueue;
