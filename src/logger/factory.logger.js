import { enviroment } from "../config/app/index.js";

export let logger;
switch (enviroment) {
  case "development":
    console.log("devLog");
    const { default: devLogger } = await import("./dev.logger.js");
    logger = devLogger;
    break;
  case "production":
    console.log("prodLog");
    const { default: prodLogger } = await import("./prod.logger.js");
    logger = prodLogger;
    break;
}
