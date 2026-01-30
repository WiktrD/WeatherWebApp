import App from './app';
import IndexController from "./controlers/IndexController";
import UserController from "./controlers/UserController";
import DataController from "./controlers/DataController";
import dotenv from 'dotenv';
import DataService from "./modules/services/data.service";
import Controller from "./interfaces/controllerInterface";
import TokenService from "./modules/services/token.service";
import UserService from "./modules/services/user.service";
import PasswordService from "./modules/services/password.service";
import {startWeatherFetcher} from "./weatherFetcher";
dotenv.config();
function createControllers(): Controller[] {
    const dataService = new DataService();
    const userService = new UserService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();

    return [
        new UserController(userService, passwordService, tokenService),
        new DataController(dataService),
        new IndexController()
    ];
}
const controllers = createControllers();
const app: App = new App(controllers);

async function main() {
    await app.connectToDatabase();
    app.listen();
    startWeatherFetcher();
}

const cleanupService = new TokenService();
setInterval(async () => {
    await cleanupService.removeExpiredTokens();
}, 60 * 60 * 1000);

main().catch(err => {
    console.error('Błąd podczas uruchamiania aplikacji:', err);
});