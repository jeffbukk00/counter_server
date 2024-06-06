"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const countSchema = new mongoose_1.Schema({
    offset: Number,
    updatedCurrentCount: Number,
    isPositive: Boolean,
    isResetHistory: Boolean,
    comment: String,
    timestamp: Date,
});
exports.default = (0, mongoose_1.model)("Count", countSchema);
