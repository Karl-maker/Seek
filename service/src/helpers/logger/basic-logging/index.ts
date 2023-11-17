import { ILogger } from "..";

class MyLogger implements ILogger {
    error(message: string, data: any = "") {
      console.error(`[${new Date()}] ERROR: ${message}`, data);
    }
  
    debug(message: string, data: any = "") {
        console.debug(`[${new Date()}] DEBUG: ${message}`, data);
    }
  
    info(message: string, data: any = "") {
        console.log(`[${new Date()}] INFO: ${message}`, data);
    }
  
    warning(message: string, data: any = "") {
        console.warn(`[${new Date()}] WARN: ${message}`, data);
    }
  
    fatal(message: string, data: any = "") {
        console.error(`[${new Date()}] FATAL: ${message}`, data);
    }
}

export const logger = new MyLogger();