// 카운터에 대한 모델 생성.

import { Schema, model } from "mongoose";
import achievementStack from "./logging/achievementStack";

const counterSchema = new Schema({
  title: String,
  startCount: Number,
  currentCount: Number,
  endCount: Number,
  direction: Number,
  achievementStack: Number,
  achievementStackHistory: [
    { type: Schema.Types.ObjectId, ref: "Achievement-Stack" },
  ],
  motivationTextIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Text" }],
  motivationLinkIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Link" }],
});

export default model("Counter", counterSchema);
