import axios from "axios";

export const weatherApi = axios.create({
    baseURL: `https://api.weatherapi.com/v1/`
});

export const exchangerApi = axios.create({
    baseURL: `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGER_API_KEY}/latest/`
});