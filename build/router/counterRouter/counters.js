"use strict";
// 복수의 카운터들에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const counters_1 = __importDefault(require("../../controller/controllers/counterController/counters"));
// 버킷 내 존재하는 카운터들에 대한 id를 가져오는 경로.
router.get("/:bucketId/ids", counters_1.default.getCounterIds);
router.post("/:bucketId/position", counters_1.default.changeCounterPosition);
// 카운터를 생성하는 경로.
router.post("/:bucketId", counters_1.default.createCounter);
// 카운터를 복제하는 경로.
router.post("/:bucketId/duplicate/:counterId", counters_1.default.duplicateCounter);
// 카운터를 다른 버킷으로 이동시키는 경로.
router.post("/:bucketIdSubject/move/:counterId", counters_1.default.moveCounter);
// 카운터를 제거하는 경로.
router.delete("/:bucketId/:counterId", counters_1.default.removeCounter);
exports.default = router;
