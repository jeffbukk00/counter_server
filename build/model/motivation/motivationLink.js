"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const motivationLinkModel = new mongoose_1.Schema({
    title: String,
    link: String,
});
exports.default = (0, mongoose_1.model)("Motivation-Link", motivationLinkModel);
