import Controller from '../interfaces/controllerInterface';
import {Request, Response, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import {admin} from '../middlewares/admin.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import {role} from "../middlewares/role.middleware";
import {IUser} from "../modules/models/user.model";


class UserController implements Controller {
    public path = '/api/user';
    public router = Router();


    constructor(  private userService: UserService,
                  private passwordService: PasswordService,
                  private tokenService: TokenService)
    {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(`${this.path}/create`, this.createNewOrUpdate);
        this.router.post(`${this.path}/auth`, this.authenticate);
        this.router.post(`${this.path}/reset`, this.resetPassword);
        this.router.get(`${this.path}/all`, this.getAllUsers);
        this.router.delete(`${this.path}/logout`, auth, this.removeHashSession);
        this.router.delete('/api/token/expired', async (req, res) => {
            const result = await this.tokenService.removeExpiredTokens();
            res.status(200).json(result);
        });
    }

    private createNewOrUpdate = async (req: Request, res: Response): Promise<void> => {
        const userData = req.body;

        try {
            const user = await this.userService.createNewOrUpdate(userData) as IUser ;


            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password);
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword,
                });
            }

            res.status(200).json(user);
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            res.status(400).json({
                error: 'Bad request',
                value: error.message || 'Unknown error'
            });
        }
    };


    private authenticate = async (req: Request, res: Response): Promise<Response> => {
        const { login, password } = req.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const isAuthorized = await this.passwordService.authorize(user._id, password);
            if (!isAuthorized) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const token = await this.tokenService.create(user);
            return res.status(200).json(this.tokenService.getToken(token));
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            return res.status(401).json({ error: 'Unauthorized' });
        }
    };

    private removeHashSession = async (req: Request, res: Response): Promise<void> => {

        try {
            const user = (req as any).user;
            const result = await this.tokenService.remove(user._id);
            res.status(200).send(result);
        } catch (error: any) {
            console.error('Validation Error:', error.message);
            res.status(401).json({ error: 'Unauthorized' });
        }
    };

    private resetPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email wymagany' });

        try {
            const user = await this.userService.getByEmailOrName(email);
            if (!user) return res.status(404).json({ error: 'Użytkownik nie znaleziony' });

            const newPassword = Math.random().toString(36).slice(-8);
            const hashed = await this.passwordService.hashPassword(newPassword);
            await this.passwordService.createOrUpdate({ userId: user._id!, password: hashed });

            console.log(`Nowe hasło dla ${user.email}: ${newPassword}`);

            res.status(200).json({ message: 'Hasło zresetowane. Sprawdź skrzynkę e-mail.' });
        } catch (err: any) {
            console.error('Błąd resetowania hasła:', err.message);
            res.status(500).json({ error: 'Błąd serwera' });
        }
    };

    private getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to fetch users' });
        }
    };


}


export default UserController;