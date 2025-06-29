import { Hono } from "hono";
import weatherRoute from "./routes/weather";
import mongoose from "mongoose";
import exchangerRoute from "./routes/exchanger";
import statusRouter from "./routes/status";
import { rateLimiter } from "hono-rate-limiter";

// check envs throw error

await mongoose.connect("mongodb://127.0.0.1:27017/surf");

const app = new Hono()
  .use(
    rateLimiter({
      limit: 5,
      windowMs: 1000 * 60 * 30,
      keyGenerator: (c) => "123"
    })
  )
  .route("/weather", weatherRoute)
  .route("/currency", exchangerRoute)
  .route("/status", statusRouter);

export default app;
