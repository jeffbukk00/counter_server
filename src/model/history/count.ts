import { boolean } from "joi";
import { Schema, model } from "mongoose";

const countSchema = new Schema({
  offset: Number,
  updatedCurrentCount: Number,
  isPositive: Boolean,
  isResetHistory: Boolean,
  comment: String,
  timestamp: Date,
});

export default model("Count", countSchema);
