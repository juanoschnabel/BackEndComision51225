import { Router } from "express";
// import { addLogger } from "./utils/logger.js";
import { addLogger } from "../utils/logger.js";

const logger = Router();
logger.use(addLogger);
logger.get("/", (req, res) => {
  req.logger.fatal("Fatal");
  req.logger.error("Error");
  req.logger.warning("Warning");
  req.logger.info("Info");
  req.logger.debug("Debug");
  res.send({ message: " Estamos probando el logger" });
});
export default logger;
