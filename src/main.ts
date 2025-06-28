import { Hono } from 'hono'
import weatherRoute from './routes/weather'
import mongoose from 'mongoose';
import exchangerRoute from './routes/exchanger';
import statusRouter from './routes/status';

// check envs throw error

await mongoose.connect("mongodb://127.0.0.1:27017/surf");

const app = new Hono()
    .route("/weather", weatherRoute)
    .route("/currency", exchangerRoute)
    .route("/status", statusRouter)

export default app
