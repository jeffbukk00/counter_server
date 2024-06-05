import { Schema, model } from "mongoose";

const achievementStackSchema = new Schema({
  stack: Number,
  comment: String,
  countHistory: [{ type: Schema.Types.ObjectId, ref: "Count" }],
  timeStamp: Date,
});

export default model("Achievement-Stack", achievementStackSchema);
