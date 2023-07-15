import dotenv from "dotenv";
dotenv.config();
export default {
  URL_MONGODB_ATLAS: process.env.URL_MONGODB_ATLAS,
  SALT: process.env.SALT,
  PORT: process.env.PORT,
  GITHUB_CLIENTID: process.env.GITHUB_CLIENTID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  CALLBACK_URL_GITHUB: process.env.CALLBACK_URL_GITHUB,
  HASH_PASSWORD_GITHUB: process.env.HASH_PASSWORD_GITHUB,
  SECRET_kEY_JWT: process.env.SECRET_kEY_JWT,
};
