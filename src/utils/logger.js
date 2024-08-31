import winston from "winston";
import { config } from "dotenv";

const niveles = {
    fatal: 0, 
    error: 1, 
    warning: 2,
    info: 3, 
    http: 4, 
    debug: 5
}

const loggerDevelopment = winston.createLogger({
    levels: niveles, 
    transports: [
        new winston.transports.Console({
            level: "debug"
        })
    ]
})

const loggerProduction = winston.createLogger({
    levels: niveles, 
    transports: [
        new winston.transports.File({
            filename: "./errors.log", 
            level: "error"
        })
    ]
})

const logger = config === "production" ? loggerProduction : loggerDevelopment; 

const addLogger = (req, res, next) => {
    req.logger = logger; 
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
}
export default addLogger;