import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IUser } from "../modules/models/user.model";

export const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers['x-auth-token'] || request.headers['authorization'];
    if (token && typeof token === 'string') {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        try {
            const decoded = jwt.verify(token, config.JwtSecret) as IUser;

            if (!decoded.role) {
                console.warn('Brak roli w tokenie');
            }

            (request as any).user = decoded;
            next();
        } catch (err: any) {
            console.error('Błąd JWT:', err.message);
            response.status(400).send('Nieprawidłowy token.');
        }
    } else {
        return response.status(401).send('Brak tokenu. Dostęp zabroniony.');
    }
};