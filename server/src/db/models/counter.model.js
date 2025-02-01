import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 1 },
});

const Counter = model("Counter", counterSchema);

export default Counter;
