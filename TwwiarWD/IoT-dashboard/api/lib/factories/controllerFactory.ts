

import DataService from "../modules/services/data.service";
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import Controller from "../interfaces/controllerInterface";
import DataController from "../controlers/DataController";
import UserController from "../controlers/UserController";
import IndexController from "../controlers/IndexController";



export function createControllers(): Controller[] {
    const dataService = new DataService();
    const userService = new UserService();
    const passwordService = new PasswordService();
    const tokenService = new TokenService();

    return [
        new DataController(dataService),
        new UserController(userService, passwordService, tokenService),
        new IndexController()
    ];
}
