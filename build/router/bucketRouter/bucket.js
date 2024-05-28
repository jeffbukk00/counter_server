"use strict";
// 단일 버킷에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const bucket_1 = __importDefault(require("../../controller/controllers/bucketController/bucket"));
// 단일 버킷을 가져오는 경로.
router.get("/:bucketId", bucket_1.default.getBucket);
// 버킷을 수정하는 경로.
router.put("/:bucketId", bucket_1.default.editBucket);
exports.default = router;
