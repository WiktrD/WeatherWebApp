import DataService from "./modules/services/data.service";
import axios from 'axios';
import { config } from './config';

const DEVICE_ID = 100;
const town = "Tarnow,pl";
const interval=5 * 60 * 1000;

const dataService = new DataService();

async function fetchWeatherAndSave() {
    try {
        const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: town,
                appid: config.weatherApiKey,
                units: 'metric'
            }
        });

        const weatherData = response.data.main;

        const dataToSave = {
            temperature: weatherData.temp,
            pressure: weatherData.pressure,
            humidity: weatherData.humidity,
            deviceId: DEVICE_ID,
            readingDate: new Date()
        };

        await dataService.createData(dataToSave);

        console.log('Pobrano i zapisano dane pogodowe:', dataToSave);
    } catch (error) {

        console.error('Błąd podczas pobierania lub zapisywania danych pogodowych:', error.message);
    }
}

export function startWeatherFetcher() {
    fetchWeatherAndSave();
    setInterval(fetchWeatherAndSave, interval);
}