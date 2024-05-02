import { Schema, model } from "mongoose";

const bucketSchema = new Schema({
  bucketTitle: String,
  counterIds: [{ type: Schema.Types.ObjectId, ref: "Counter" }],
  motivationIds: [Schema.Types.ObjectId],
});

export default model("Bucket", bucketSchema);
