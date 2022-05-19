import dotenv from "dotenv";
dotenv.config();
import dbConnector from "./config";
import Logger from "./logger/logger";

import { server, io } from './socket'

const PORT = process.env.PORT;
(async () => {
  try {
    await dbConnector();
    Logger.info("DB connected");
    server.listen(PORT, () => {
      Logger.info(`Server started on port ${PORT}`);
    });

  } catch (error) {
    Logger.error(error);
  }
})();
