import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: generateCode, // Utilizar la función generateCode como valor por defecto
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
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

mongoose.set("strictQuery", false);

export const ticketModel = model("Ticket", ticketSchema);

// Función para generar un código aleatorio de 6 dígitos
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
