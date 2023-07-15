import jwt from "jsonwebtoken";
import config from "../utils/config";
export const jwtValidatio = (req, res, next) => {
  const autorizathionHeader = req.get("Authorization");
  const token = autorizathionHeader.split(" ")[1];
  const isValid = jwt.verify(token, config.SECRET_KEY_JWT);
  next();
};
