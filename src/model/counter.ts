// 카운터에 대한 모델 생성.

import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  title: String,
  startCount: Number,
  currentCount: Number,
  endCount: Number,
  direction: Number,
  achievementStack: Number,
  motivationTextIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Text" }],
  motivationLinkIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Link" }],
});

export default model("Counter", counterSchema);
