"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const buckets_1 = __importDefault(require("@/controller/bucketController/buckets"));
router.get("/", buckets_1.default.getBuckets);
router.get("/ids", buckets_1.default.getBucketIds);
router.post("/", buckets_1.default.createBucket);
router.post("/duplicate/:bucketId", buckets_1.default.duplicateBucket);
router.post("/merge/:bucketIdSubject", buckets_1.default.mergeBuckets);
router.delete("/:bucketId", buckets_1.default.removeBucket);
exports.default = router;
