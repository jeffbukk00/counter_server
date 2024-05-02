import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  counterTitle: String,
  startCount: Number,
  currentCount: Number,
  endCount: Number,
  direction: Number,
  achievementStack: Number,
  bucketId: { type: Schema.Types.ObjectId, ref: "Bucket" },
  motivationIds: [Schema.Types.ObjectId],
});

export default model("Counter", counterSchema);
