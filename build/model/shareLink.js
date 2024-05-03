"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareLinkSchema = new mongoose_1.Schema({
    bucket: {
        title: String,
        motivationTexts: [{ text: String }],
        motivationLinks: [{ title: String, link: String }],
    },
    counters: [
        {
            title: String,
            startCount: Number,
            endCount: Number,
            direction: Number,
            motivationTexts: [{ text: String }],
            motivationLinks: [{ title: String, link: String }],
        },
    ],
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    expirationDate: Date,
});
exports.default = (0, mongoose_1.model)("ShareLink", shareLinkSchema);
