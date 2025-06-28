import { z } from "zod";

export const conditionSchema = z.object({
  text: z.string(),
});

export const daySchema = z.object({
  maxtemp_c: z.number(),
  mintemp_c: z.number(),
  avgtemp_c: z.number(),
  maxwind_kph: z.number(),
  totalprecip_mm: z.number(),
  condition: conditionSchema,
});
export const astroSchema = z.object({
  sunrise: z.string(),
  sunset: z.string(),
  moon_phase: z.string(),
});
export const hourSchema = z.object({
  temp_c: z.number(),
  condition: conditionSchema,
  precip_mm: z.number(),
  feelslike_c: z.number(),
  humidity: z.number(),
  cloud: z.number(),
});

export const forecastdaySchema = z.object({
  date: z.string(),
  day: daySchema,
  astro: astroSchema,
  hour: z.array(hourSchema),
});

export const currentWeatherSchema = z.object({
  condition: conditionSchema,
  temp_c: z.number(),
  wind_kph: z.number(),
  precip_mm: z.number(),
  humidity: z.number(),
  cloud: z.number(),
  feelslike_c: z.number(),
  uv: z.number(),
});

export const forecastSchema = z.object({
  forecastday: z.array(forecastdaySchema),
});

export const weatherApiResponseSchema = z.object({
  current: currentWeatherSchema,
  forecast: forecastSchema,
});
export type weatherApiResponseType = z.infer<typeof weatherApiResponseSchema>;

export const exchangerApiResponseSchema = z.object({
  base_code: z.string(),
  conversion_rates: z.object({
    USD: z.number(),
    EUR: z.number(),
    UAH: z.number(),
  }),
});
export type exchangerApiResponseType = z.infer<typeof exchangerApiResponseSchema>;
