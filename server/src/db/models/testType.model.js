
import { Schema, model } from "mongoose";

const testTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const TestType = model("TestType", testTypeSchema);

export default TestType;
