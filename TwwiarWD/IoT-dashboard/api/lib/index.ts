import App from './app';
import IndexController from "./controlers/IndexController";
import UserController from "./controlers/UserController";
import DataController from "./controlers/DataController";

const app: App = new App([
    new UserController(),
    new DataController(),
    new IndexController()
]);

app.listen();