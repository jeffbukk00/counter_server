import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  title: String,
  startCount: Number,
  currentCount: Number,
  endCount: Number,
  direction: Number,
  achievementStack: Number,
  motivationIds: [Schema.Types.ObjectId],
});

export default model("Counter", counterSchema);
