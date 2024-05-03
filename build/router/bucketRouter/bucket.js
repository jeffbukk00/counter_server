"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const bucket_1 = __importDefault(require("@/controller/bucketController/bucket"));
router.get("/:bucketId", bucket_1.default.getBucket);
router.put("/:bucketId", bucket_1.default.editBucket);
exports.default = router;
