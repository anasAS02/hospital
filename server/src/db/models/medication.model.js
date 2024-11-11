import { Schema, model } from "mongoose";

const medicationSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Medication = model("Medication", medicationSchema);

export default Medication;
