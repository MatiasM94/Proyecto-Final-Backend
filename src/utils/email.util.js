import nodemailer from "nodemailer";
import { nodemailerConfig } from "../config/app/index.js";

const transport = nodemailer.createTransport({
  service: nodemailerConfig.serviceMail,
  port: nodemailerConfig.serviceMailPort,
  auth: {
    user: nodemailerConfig.emailUser,
    pass: nodemailerConfig.emailPassword,
  },
});

export default transport;
