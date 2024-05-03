import { Schema, model } from "mongoose";

const motivationTextModel = new Schema({
  text: String,
});

export default model("Motivation-Text", motivationTextModel);
