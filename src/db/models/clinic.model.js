import { Schema, model } from "mongoose";

const clinicSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  doctors: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

const Clinic = model("Clinic", clinicSchema);

export default Clinic;
