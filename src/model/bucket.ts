import { Schema, model } from "mongoose";

const bucketSchema = new Schema({
  title: String,
  counterIds: [{ type: Schema.Types.ObjectId, ref: "Counter" }],
  motivationTextIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Text" }],
  motivationLinkIds: [{ type: Schema.Types.ObjectId, ref: "Motivation-Link" }],
});

export default model("Bucket", bucketSchema);
