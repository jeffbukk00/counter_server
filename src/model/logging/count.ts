import { boolean } from "joi";
import { Schema, model } from "mongoose";

const countSchema = new Schema({
  offset: Number,
  updatedCurrentCount: Number,
  isPositive: Boolean, // boolean || null
  isResetHistory: Boolean,
  comment: String,
  timeStamp: Date,
});

export default model("Count", countSchema);
