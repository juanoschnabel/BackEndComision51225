import jwt from "jsonwebtoken";
export const jwtValidatio = (req, res, next) => {
  const autorizathionHeader = req.get("Authorization");
  const token = autorizathionHeader.split(" ")[1];
  const isValid = jwt.verify(token, process.env.SECRET_KEY_JWT);
  next();
};
