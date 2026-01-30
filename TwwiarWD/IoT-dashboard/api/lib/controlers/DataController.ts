import Controller from "../interfaces/controllerInterface"
import { Request, Response, NextFunction, Router } from 'express';
import {checkIdParam} from "../middlewares/deviceIdParam.middleware";
import DataService from "../modules/services/data.service";
import * as Joi from "joi";
import {config} from "../config";
import {auth} from "../middlewares/auth.middleware";
import {admin} from "../middlewares/admin.middleware";

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    private testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

    constructor(private dataService: DataService) {
        this.initializeRoutes();
    }


    private initializeRoutes() {

        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/latest/all`, this.getLatestForAllDevices);
        this.router.post(`${this.path}/:id`, auth, checkIdParam, this.addData);
        this.router.get(`${this.path}/:id`, auth, checkIdParam, this.getAllDeviceData);
        this.router.get(`${this.path}/:id/latest`, auth, checkIdParam, this.getLatestForDevice);
        this.router.get(`${this.path}/:id/:num`, auth, checkIdParam, this.getPeriodData);
        this.router.delete(`${this.path}/all`, auth, admin, this.cleanAllDevices);
        this.router.delete(`${this.path}/:id`, auth, admin, checkIdParam, this.cleanDeviceData);
        this.router.delete(`${this.path}/:id/data`, auth, admin, checkIdParam, this.deleteDeviceData);
        this.router.delete(`${this.path}/:id/range`, auth, admin, checkIdParam, this.deleteDeviceDataInRange);
    }

    private getLatestReadingsFromAllDevices = async (req: Request, res: Response) => {
        try {
            const data = await this.dataService.getAllNewest(config.supportedDevicesNum);
            res.status(200).json(data);
        } catch (error) {
            console.error('Błąd podczas pobierania danych z MongoDB:', error);
            res.status(500).json({ error: 'Błąd podczas pobierania danych z bazy.' });
        }
    }

    private getAllDeviceData = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const allData = await this.dataService.query(id);
            res.status(200).json(allData);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych.' });
        }
    };

    private addData = async (req: Request, res: Response) => {
        const { air } = req.body;
        const { id } = req.params;

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
            const validatedData = await schema.validateAsync({ air, deviceId: parseInt(id, 10) });

            const readingData = {
                temperature: validatedData.air[0].value,
                pressure: validatedData.air[1].value,
                humidity: validatedData.air[2].value,
                deviceId: validatedData.deviceId,
                readingDate: new Date()
            };

            await this.dataService.createData(readingData);
            res.status(200).json(readingData);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            res.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private getLatestForDevice = async (req: Request, res: Response) => {
        const deviceId = parseInt(req.params.id, 10);
        if (isNaN(deviceId)) return res.status(400).json({ error: 'Nieprawidłowy ID' });

        try {
            const data = await this.dataService.get(deviceId);
            res.status(200).json(data[0] || {});
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas pobierania danych' });
        }
    };

    private getLatestForAllDevices = async (req: Request, res: Response) => {
        try {
            const data = await this.dataService.getAllNewest(config.supportedDevicesNum);
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas pobierania danych' });
        }
    };

    private deleteDeviceData = async (req: Request, res: Response) => {
        const deviceId = parseInt(req.params.id, 10);
        if (isNaN(deviceId)) return res.status(400).json({ error: 'Nieprawidłowy ID' });

        try {
            await this.dataService.deleteData(deviceId);
            res.status(200).json({ message: `Usunięto dane dla urządzenia ${deviceId}` });
        } catch (error) {
            res.status(500).json({ error: 'Błąd podczas usuwania danych' });
        }
    };

    private deleteDeviceDataInRange = async (req: Request, res: Response) => {
        const deviceId = parseInt(req.params.id, 10);

        const { from, to } = req.query;

        if (isNaN(deviceId)) {
            return res.status(400).json({ error: 'Nieprawidłowy ID' });
        }

        if (!from || !to) {
            return res.status(400).json({ error: 'Brakuje parametrów "from" lub "to"' });
        }

        try {
            const fromDate = new Date(from as string);
            const toDate = new Date(to as string);

            const deletedCount = await this.dataService.deleteReadingsInRange(deviceId, fromDate, toDate);
            res.status(200).json({ message: `Usunięto ${deletedCount} odczytów.` });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Błąd podczas usuwania danych z zakresu czasu.' });
        }
    };

    private getPeriodData = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        const num = parseInt(req.params.num) || 1;

        if (isNaN(id) || isNaN(num) || id < 0 || id + num > this.testArr.length) {
            return res.status(400).json({ message: 'Błędne parametry zakresu' });
        }

        res.status(200).json({ range: this.testArr.slice(id, id + num) });
    };

    private cleanAllDevices = async (req: Request, res: Response) => {
        this.testArr = [];
        res.status(200).json({ message: 'Wszystkie dane zostały usunięte (z pamięci)' });
    };

    private cleanDeviceData = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id < 0 || id >= this.testArr.length) {
            return res.status(404).json({ message: 'Nie znaleziono danych do usunięcia' });
        }

        this.testArr.splice(id, 1);
        res.status(200).json({ message: `Usunięto dane lokalne dla ID ${id}` });
    };
}


    export default DataController;
