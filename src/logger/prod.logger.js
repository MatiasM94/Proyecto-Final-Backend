import winston from "winston";
import customLevelOptions from "../utils/loggerCustom.js";

const prodLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./logs/errors.log",
      level: "warning",
      format: winston.format.simple(),
    }),
  ],
});

export default prodLogger;
