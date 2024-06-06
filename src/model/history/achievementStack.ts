import { boolean } from "joi";
import { Schema, model } from "mongoose";

const achievementStackSchema = new Schema({
  isAchieved: Boolean,
  stack: Number,
  comment: String,
  countHistory: [{ type: Schema.Types.ObjectId, ref: "Count" }],
  createdAt: Date,
  achievedAt: Schema.Types.Mixed, // Date || null
});

export default model("Achievement-Stack", achievementStackSchema);
