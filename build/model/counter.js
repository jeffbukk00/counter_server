"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const counterSchema = new mongoose_1.Schema({
    counterTitle: String,
    startCount: Number,
    currentCount: Number,
    endCount: Number,
    direction: Number,
    achievementStack: Number,
    bucketId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Bucket" },
    motivationIds: [mongoose_1.Schema.Types.ObjectId],
});
exports.default = (0, mongoose_1.model)("Counter", counterSchema);
