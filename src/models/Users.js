import { Schema, model } from "mongoose";
import mongoose from "mongoose";
const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  gender: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
mongoose.set("strictQuery", false);
export const userModel = mongoose.model("users", userSchema);
