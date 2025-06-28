import mongoose, { Schema } from "mongoose";
import { weatherApiResponseType } from "./schema";

type WeatherSchemaMongoose = {
  city: string;
  body: weatherApiResponseType;
  lastUpdate: number;
};

const weatherSchema = new Schema<WeatherSchemaMongoose>({
  city: String,
  lastUpdate: Number,
  body: Object,
});

export const weatherModel = mongoose.model("weather", weatherSchema);

export async function writeWeather(
  city: string,
  weather: weatherApiResponseType
) {
  await new weatherModel({
    city,
    lastUpdate: Date.now(),
    body: weather,
  }).save();
}

export async function getWeather(city: string) {
  const dbRes = await weatherModel.findOne(
    { city: { $eq: city } },
    {
      _id: 0,
      __v: 0,
    }
  );
  return dbRes;
}

export async function deleteSingleWeather(city: string) {
  const dbRes = await weatherModel.deleteOne({ city: { $eq: city } });
  return dbRes;
}
