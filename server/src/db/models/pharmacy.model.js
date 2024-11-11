import { Schema, model } from "mongoose";

const pharmacySchema = new Schema(
    {
      patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
      patient_name: { type: String, required: true },
      medications: [{
        medication: { type: String, required: true },  // Name of the medication
        notes: { type: String, required: true },  // Notes for the medication
      }],
      pickup_status: { type: String, enum: ["في انتظار الاستلام", "تم الاستلام"], default: "في انتظار الاستلام" },
      total: { type: Number, required: true },
      payment_status: { type: Boolean, required: true },
    },
    { timestamps: true }
  );
  
  
  const Pharmacy = model("Pharmacy", pharmacySchema);
  export default Pharmacy;
  