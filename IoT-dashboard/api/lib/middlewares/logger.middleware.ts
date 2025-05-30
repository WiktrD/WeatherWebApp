import { RequestHandler, Request, Response, NextFunction } from 'express';
import { config } from "../config";

export const log: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    console.log(`[${request.method} ${request.url} ${new Date().toISOString()}]`);
    next();
};