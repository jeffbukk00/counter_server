"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bucketSchema = new mongoose_1.Schema({
    title: String,
    counterIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Counter" }],
    motivationTextIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Motivation-Text" }],
    motivationLinkIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Motivation-Link" }],
});
exports.default = (0, mongoose_1.model)("Bucket", bucketSchema);
