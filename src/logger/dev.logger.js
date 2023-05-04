import winston from "winston";
import customLevelOptions from "../utils/loggerCustom.js";

const devLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

export default devLogger;
