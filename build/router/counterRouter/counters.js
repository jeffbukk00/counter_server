"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const counters_1 = __importDefault(require("@/controller/counterController/counters"));
router.get("/:bucketId/ids", counters_1.default.getCounterIds);
router.post("/:bucketId", counters_1.default.createCounter);
router.post("/:bucketId/duplicate/:counterId", counters_1.default.duplicateCounter);
router.post("/:bucketIdSubject/move/:counterId", counters_1.default.moveCounter);
router.delete("/:bucketId/:counterId", counters_1.default.removeCounter);
exports.default = router;
