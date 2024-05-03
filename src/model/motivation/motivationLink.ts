import { Schema, model } from "mongoose";

const motivationLinkModel = new Schema({
  title: String,
  link: String,
});

export default model("Motivation-Link", motivationLinkModel);
