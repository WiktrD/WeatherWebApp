import { Request, Response, NextFunction } from 'express';

export const role = (...roles: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {

        const user = (request as any).user;

        if (!user) {
            return response.status(401).json({ error: 'Brak uwierzytelnienia użytkownika.' });
        }

        if (!roles.includes(user.role)) {
            return response.status(403).json({ error: 'Brak odpowiednich uprawnień!' });
        }

        next();
    };
};