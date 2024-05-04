"use strict";
// 복수의 버킷들에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const buckets_1 = __importDefault(require("@/controller/controllers/bucketController/buckets"));
// 유저가 가진 버킷들을 가져오기 위한 경로.
router.get("/", buckets_1.default.getBuckets);
// 유저가 가진 버킷들의 id를 가져오기 위한 경로.
router.get("/ids", buckets_1.default.getBucketIds);
// 버킷을 생성하는 경로.
router.post("/", buckets_1.default.createBucket);
// 버킷을 복제하는 경로.
router.post("/duplicate/:bucketId", buckets_1.default.duplicateBucket);
// 서로 다른 두 버킷들을 병합하는 경로.
router.post("/merge/:bucketIdSubject", buckets_1.default.mergeBuckets);
// 버킷을 삭제하는 경로.
router.delete("/:bucketId", buckets_1.default.removeBucket);
exports.default = router;
