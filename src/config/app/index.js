import * as dotenv from "dotenv";

dotenv.config({
  path: `./.env.${process.env.NODE_ENV}`,
});

export const mongodb = {
  mongoConnect: process.env.MONGO_CONNECT,
  secretMongoKey: process.env.SECRET_MONGO_KEY,
};

export const nodemailerConfig = {
  emailUser: process.env.EMAIL_USER,
  emailPassword: process.env.EMAIL_PASSWORD,
  serviceMail: process.env.SERVICE_MAIL,
  serviceMailPort: process.env.SERVICE_MAIL_PORT,
};

export const googleAuth = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
};

export const persistence = process.env.PERSISTENCE;

export const port = process.env.PORT;

export const jwtSecretKey = process.env.JWT_SECRET_KEY;

export const enviroment = process.env.NODE_ENV;
