"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const achievementStackSchema = new mongoose_1.Schema({
    stack: Number,
    comment: String,
    countHistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Count" }],
    timeStamp: Date,
});
exports.default = (0, mongoose_1.model)("Achievement-Stack", achievementStackSchema);
