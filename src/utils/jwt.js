import jwt from "jsonwebtoken";
import { jwtSecretKey } from "../config/app/index.js";

export const generateToken = (payload) => {
  const token = jwt.sign({ payload }, jwtSecretKey, {
    expiresIn: "1h",
  });
  return token;
};
