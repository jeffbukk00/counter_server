// 모티베이션 텍스트에 대한 모델 생성.

import { Schema, model } from "mongoose";

const motivationTextModel = new Schema({
  text: String,
});

export default model("Motivation-Text", motivationTextModel);
