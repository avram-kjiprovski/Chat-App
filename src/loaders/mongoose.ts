import {dbConnector} from "@/config";
import Logger from "@/logger/logger";

// Singleton DB Loader
// idea is to load this once and then start the program
export class Mongoose {
  constructor() {
    this.connect();
  }
  async connect() {
      try {
        await dbConnector();
        Logger.info("DB loaded");
      } catch (error) {
        Logger.error("DB failed load: ", error);
        Logger.error('Trying to reconnect...');
        setTimeout(() => {
          this.connect();
        }
        , 5000);
      }
  }
}
