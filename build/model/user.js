"use strict";
// 유저에 대한 모델 생성.
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: String,
    username: String,
    profilePictureUrl: String,
    snsId: String,
    provider: String,
    bucketIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Bucket" }],
    unreadGuideIds: [String],
});
exports.default = (0, mongoose_1.model)("User", userSchema);
