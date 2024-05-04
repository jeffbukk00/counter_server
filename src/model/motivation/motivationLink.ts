// 모티베이션 링크에 대한 모델 생성.

import { Schema, model } from "mongoose";

const motivationLinkModel = new Schema({
  title: String,
  link: String,
});

export default model("Motivation-Link", motivationLinkModel);
