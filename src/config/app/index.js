import * as dotenv from "dotenv";

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`,
});

export const persistence = process.env.PERSISTENCE;

export const port = process.env.PORT;

export const mongoPassword = process.env.MONGO_PASSWORD;

export const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const enviroment = process.env.NODE_ENV;

export const adminId = process.env.ADM_ID;

export const emailUser = process.env.EMAIL_USER;

export const emailPassword = process.env.EMAIL_PASSWORD;

export const serviceMail = process.env.SERVICE_MAIL;

export const serviceMailPort = process.env.SERVICE_MAIL_PORT;
