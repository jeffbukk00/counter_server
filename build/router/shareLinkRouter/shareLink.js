"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const shareLink_1 = __importDefault(require("@/controller/shareLinkController/shareLink"));
router.post("/upload", shareLink_1.default.uploadShareLink);
router.get("/:shareLinkId/validation", shareLink_1.default.validateShareLink);
router.post("/:shareLinkId/download/all", shareLink_1.default.downloadShareLinkAll);
router.post("/:shareLinkId/download/secure", shareLink_1.default.downloadShareLinkSecure);
exports.default = router;
