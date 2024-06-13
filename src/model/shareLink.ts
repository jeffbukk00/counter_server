import { Schema, model } from "mongoose";

const shareLinkSchema = new Schema({
  bucket: {
    title: String,
    motivationTexts: [{ text: String }],
    motivationLinks: [{ title: String, link: String }],
  },
  counters: [
    {
      title: String,
      startCount: Number,
      endCount: Number,
      direction: Number,
      motivationTexts: [{ text: String }],
      motivationLinks: [{ title: String, link: String }],
    },
  ],
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  expirationDate: Date,
});

export default model("Share-Link", shareLinkSchema);
