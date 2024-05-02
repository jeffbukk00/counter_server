"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const motivationTextModel = new mongoose_1.Schema({
    type: Number,
    text: String,
});
exports.default = (0, mongoose_1.model)("MotivationText", motivationTextModel);
