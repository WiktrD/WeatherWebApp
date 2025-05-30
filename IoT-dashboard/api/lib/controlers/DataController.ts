import Controller from "../interfaces/controllerInterface"
import { Request, Response, NextFunction, Router } from 'express';
import {checkIdParam} from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import * as Joi from "joi";
import {IData} from "../modules/models/data.model";
let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    constructor(private dataService: DataService) {
        this.initializeRoutes();
    }


    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevicesDb);
        this.router.post(`${this.path}/:id`, checkIdParam, this.adddbData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getPeriodData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getPeriodData);
        this.router.delete(`${this.path}/all`, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.cleanDeviceData);
        //this.router.delete(`${this.path}/all`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.get(`${this.path}/:id/latest`, this.);
        this.router.delete(`${this.path}/:id`, this.getLatestReadingsFromAllDevices);
        this.router.post(`${this.path}/:id`, this.addData);
    }
    private getLatestReadingsFromAllDevices = async (request: Request, response: Response) => {

            const res = request.body
            response.status(200).json(testArr[testArr.length]);

    };
    private addData = async (request: Request, response: Response) => {
        const { elem } = request.body;
        const { id } = request.params;

        testArr.push(elem);

        response.status(200).json(testArr);
    };
    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);
        response.status(200).json(allData);
    };

    private adddbData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const schema = Joi.object({
            air: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number().integer().positive().required(),
                        value: Joi.number().positive().required()
                    })
                )
                .unique((a, b) => a.id === b.id),
            deviceId: Joi.number().integer().positive().valid(parseInt(id, 10)).required()
        });
        try {
        const validatedData = await schema.validateAsync({air , deviceId: parseInt(id,10)});
        const readingData: IData = {
            temperature: validatedData.air[0].value,
            pressure: validatedData.air[1].value,
            humidity: validatedData.air[2].value,
            deviceId: validatedData.id,
        }



            await this.dataService.createData(readingData);
            response.status(200).json(readingData);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };


    private getLatestReadingsFromAllDevicesDb = async (request: Request, response : Response, next: NextFunction)=> {

    }

    private getPeriodData() {

    }

    private cleanAllDevices() {

    }

    private cleanDeviceData() {

    }


}

export default DataController;
