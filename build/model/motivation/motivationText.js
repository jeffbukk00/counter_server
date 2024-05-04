"use strict";
// 모티베이션 텍스트에 대한 모델 생성.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const motivationTextModel = new mongoose_1.Schema({
    text: String,
});
exports.default = (0, mongoose_1.model)("Motivation-Text", motivationTextModel);
