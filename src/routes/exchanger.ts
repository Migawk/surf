import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { exchangerApi } from "../res/axios";
import { exchangerApiResponseSchema } from "../res/schema";
import { deleteSingleCurrency, getCurrency, writeCurrency } from "../res/exchangerDb";

const exchangerRoute = new Hono();

const exchangerGetSchema = z.object({
  base_name: z.string()
});

exchangerRoute.get(
  "/:base_name",
  zValidator("param", exchangerGetSchema),
  async (c) => {
    const { base_name } = c.req.valid("param");

    const res = await exchangerApi.get<typeof exchangerApiResponseSchema>(
      `${base_name}`
    );
    const responseObj = exchangerApiResponseSchema.safeParse(res.data);

    if (res.status !== 200 || !responseObj.success) {
      return c.json(
        {
          info: res.data,
          zodInfo: responseObj.error,
        },
        400
      );
    }

    const dbRes = await getCurrency(base_name);
    if (!dbRes) {
      await writeCurrency(responseObj.data);
      console.log(1)
      return c.json(dbRes);
    }

    if (dbRes.lastUpdate + 1000 * 60 * 60 * 6 < Date.now()) {
      console.log(2)
      await deleteSingleCurrency(base_name);
      await writeCurrency(responseObj.data);
    }
    return c.json(await getCurrency(base_name));
  }
);

export default exchangerRoute;
