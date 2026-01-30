import { RequestHandler, Request, Response, NextFunction } from 'express';

export const log: RequestHandler = (request: Request, response: Response, next: NextFunction) => {
    const start = Date.now();

    response.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `[HTTP ${request.method}]` +
            ` ${request.originalUrl}` +
            ` → Status: ${response.statusCode}` +
            ` | Duration: ${duration}ms` +
            ` | Time: ${new Date().toISOString()}`
        );
    });

    next();
};