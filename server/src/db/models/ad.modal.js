import { Schema, model } from "mongoose";

const adSchema = new Schema({
  text: {
    type: String,
    required: true,  
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    required: true 
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active"
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true  
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

adSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

const Ad = model("Ad", adSchema);
export default Ad;