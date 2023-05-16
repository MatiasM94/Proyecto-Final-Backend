import nodemailer from "nodemailer";
import {
  emailPassword,
  emailUser,
  serviceMail,
  serviceMailPort,
} from "../config/app/index.js";

const transport = nodemailer.createTransport({
  service: serviceMail,
  port: serviceMailPort,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export default transport;
