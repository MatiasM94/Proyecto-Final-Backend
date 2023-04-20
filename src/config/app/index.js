import * as dotenv from "dotenv";

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`,
});

export const persistence = process.env.PERSISTENCE;

export const port = process.env.PORT;

export const mongoPassword = process.env.MONGO_PASSWORD;

export const jwtSecretKey = process.env.JWT_SECRET_KEY;
