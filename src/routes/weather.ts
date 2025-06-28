import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { weatherApi } from "../res/axios";
import { weatherApiResponseSchema } from "../res/schema";
import { deleteSingleWeather, getWeather, writeWeather } from "../res/weatherDb";

const weatherRoute = new Hono();

const weatherGetSchema = z.object({
  cityName: z.string(),
});

weatherRoute.get(
  "/:cityName",
  zValidator("param", weatherGetSchema),
  async (c) => {
    const { cityName } = c.req.valid("param");

    const params = new URLSearchParams();
    params.set("key", process.env.WEATHER_API_KEY!);
    params.set("q", cityName);
    params.set("days", "3");

    const res = await weatherApi.get<typeof weatherApiResponseSchema>(
      `forecast.json?${params.toString()}`
    );
    const responseObj = weatherApiResponseSchema.safeParse(res.data);

    if (res.status !== 200 || !responseObj.success) {
      return c.json(
        {
          info: res.data,
          zodInfo: responseObj.error,
        },
        400
      );
    }

    const dbRes = await getWeather(cityName);
    if (!dbRes) {
      await writeWeather(cityName, responseObj.data);
      return c.json(dbRes);
    }

    if (dbRes.lastUpdate + 1000 * 60 * 60 * 6 < Date.now()) {
      await deleteSingleWeather(cityName);
      await writeWeather(cityName, responseObj.data);
    }
    return c.json(await getWeather(cityName));
  }
);

export default weatherRoute;
