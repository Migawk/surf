import { describe, expect, test } from 'vitest'
import app from '../main';
import { weatherApiResponseSchema } from '../res/schema';
import { z } from "zod";

const weatherResponse = z.object({
  city: z.string(),
  body: weatherApiResponseSchema,
  lastUpdate: z.number()
})

const statusResponse = z.array(z.object({
  site: z.string(),
  status: z.boolean(),
  ping: z.number()
}))

const currencyResponse = z.object({
  base_code: z.string(),
  lastUpdate: z.number(),
  conversion_rates: z.object({
    USD: z.number(),
    EUR: z.number(),
    UAH: z.number()
  })
})

describe("Routes", () => {
  test("Weather Stockholm", async () => {
    const res = await app.request("/weather/Stockholm")
    const validBody = weatherResponse.safeParse(await res.json())
    
    expect(res.status).toBe(200)
    expect(validBody.success).toBe(true)
  });

  test("Status", async () => {
    const res = await app.request("/status")
    const validBody = statusResponse.safeParse(await res.json())

    expect(res.status).toBe(200)
    expect(validBody.success).toBe(true)
  })

  test("Currencies [USD]", async () => {
    const res = await app.request("/currency/USD")
    const validBody = currencyResponse.safeParse(await res.json())

    expect(res.status).toBe(200)
    expect(validBody.success).toBe(true)
  })
});
