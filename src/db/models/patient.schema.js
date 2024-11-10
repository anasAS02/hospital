import { model, Schema } from "mongoose";

const patientSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    medicalCondition: { type: String },
    status: {
      type: String,
      enum: ["waiting", "in consultation", "completed"],
      default: "waiting",
    },
    queueTicket: { type: Schema.Types.ObjectId, ref: "Ticket" }, // Link to ticket
    queueNumber: { type: Number, required: true }, // Queue position
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic" }, // Link to clinic
  },
  { timestamps: true }
);

const Patient = model("Patient", patientSchema);
export default Patient;
