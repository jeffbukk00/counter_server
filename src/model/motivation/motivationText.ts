import { Schema, model } from "mongoose";

const motivationTextModel = new Schema({
  type: Number,
  text: String,
});

export default model("MotivationText", motivationTextModel);
