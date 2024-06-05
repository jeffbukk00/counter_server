"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const countSchema = new mongoose_1.Schema({
    offset: Number,
    updatedCurrentCount: Number,
    isPositive: mongoose_1.Schema.Types.Mixed, // boolean || null
    isResetHistory: Boolean,
    comment: String,
    timeStamp: Date,
});
exports.default = (0, mongoose_1.model)("Count", countSchema);
