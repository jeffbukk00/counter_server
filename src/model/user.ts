import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: String,
  username: String,
  profilePictureUrl: String,
  snsId: String,
  provider: String,
  bucketIds: [{ type: Schema.Types.ObjectId, ref: "Bucket" }],
  unreadGuideIds: [String],
});

export default model("User", userSchema);
