import { Schema, model } from "mongoose";

import bcrypt from "bcrypt";
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["receptionist", "doctor", "laboratory-doctor", "pharmacist", "admin"],
    default: "receptionist",
  },
  clinicId: {
    type: Schema.Types.ObjectId,
    ref: "Clinic",
    required: function() {
      return this.role === 'doctor' || this.role === 'laboratory-doctor';
    }
  }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = model("User", userSchema);

export default User;