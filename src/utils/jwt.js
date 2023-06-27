import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET_KEY_JWT, {
    expiresIn: "1h",
  });
  return token;
};
