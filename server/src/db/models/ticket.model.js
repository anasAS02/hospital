import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  ticketNumber: { type: Number, required: true },
  ticketCode: { type: String, required: true },
  status: {
    type: String,
    enum: ["waiting", "in consultation", "completed", "in-progress"],
    default: "waiting",
  },
  patient: { type: Schema.Types.ObjectId, ref: "Patient" },
  clinic: { type: Schema.Types.ObjectId, ref: "Clinic" },
  queueNumber: { type: Number, required: true }, // Queue number for this ticket
});

const Ticket = model("Ticket", ticketSchema);

export default Ticket;
