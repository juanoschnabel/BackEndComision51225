import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: generateCode,
    required: true,
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchaser: {
    type: String,
    required: true,
  },
});

mongoose.set("strictQuery", false);

export const ticketModel = model("Ticket", ticketSchema);

function generateCode() {
  const codeLength = 6;
  let code = "";
  const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
}
