import mongoose, { Schema } from "mongoose";
import { exchangerApiResponseType } from "./schema";

type ExchangerSchemaMongoose = {
  base_code: string;
  conversion_rates: { [key: string]: number };
  lastUpdate: number;
};

const exchangerSchema = new Schema<ExchangerSchemaMongoose>({
  base_code: String,
  lastUpdate: Number,
  conversion_rates: {},
});

export const exchangerModel = mongoose.model("currency", exchangerSchema);

export async function writeCurrency(exchanger: exchangerApiResponseType) {
  await new exchangerModel({
    base_code: exchanger.base_code,
    conversion_rates: exchanger.conversion_rates,
    lastUpdate: Date.now(),
  }).save();
}

export async function getCurrency(base_code: string) {
  const dbRes = await exchangerModel.findOne(
    { base_code: { $eq: base_code } },
    {
      _id: 0,
      __v: 0,
    }
  );
  return dbRes;
}

export async function deleteSingleCurrency(base_code: string) {
  const dbRes = await exchangerModel.deleteOne({
    base_code: { $eq: base_code },
  });
  return dbRes;
}
