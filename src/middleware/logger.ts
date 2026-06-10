import type { NextFunction, Request, Response } from "express";
import fs from "fs";

const logger=((req:Request, res:Response, next:NextFunction) => {
    console.log("Time:", Date.now(), "MEthod:", req.method, "Url:", req.url);
    //logger
    const log = `\nMethod--> ${req.method} Time--> ${Date.now()} Url--> ${req.url}\n`;
    fs.appendFile("logger.txt", log, (err) => {
        // console.log(err);
    });
    // console.log(log);
    next();
});

export default logger;