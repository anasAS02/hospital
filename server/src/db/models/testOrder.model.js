
import { Schema, model } from "mongoose";

const testOrderSchema = new Schema(
  {
    patient_id: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    patient_name: { type: String, required: true },
    tests: [
      {
        test: { type: Schema.Types.ObjectId, ref: "TestType" },
        test_name: { type: String }, 
        test_price: { type: Number },
      },
    ],
    total_price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    pdfFilesPath: { type: [String] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const TestOrder = model("TestOrder", testOrderSchema);

export default TestOrder;
