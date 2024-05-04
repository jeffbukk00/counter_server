"use strict";
// 카운터에 대한 모델 생성.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    title: String,
    startCount: Number,
    currentCount: Number,
    endCount: Number,
    direction: Number,
    achievementStack: Number,
    motivationTextIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Motivation-Text" }],
    motivationLinkIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Motivation-Link" }],
});
exports.default = (0, mongoose_1.model)("Counter", counterSchema);
