import bcrypt from "bcrypt";
import config from "./config.js";
export const hashData = async (data) => {
  return bcrypt.hash(data, config.SALT);
};
export const compareData = async (data, hashData) => {
  return bcrypt.compare(data, hashData);
};
