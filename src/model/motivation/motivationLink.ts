import { Schema, model } from "mongoose";

const motivationLinkModel = new Schema({
  type: Number,
  title: String,
  link: String,
});

export default model("MotivationLink", motivationLinkModel);
