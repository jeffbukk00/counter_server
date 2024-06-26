"use strict";
// 단일 counter에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const counter_1 = __importDefault(require("@/controller/controllers/counterController/counter"));
// 단일 counter를 가져오는 경로.
router.get("/:counterId", counter_1.default.getCounter);
// counter를 수정하는 경로.
router.put("/:counterId", counter_1.default.editCounter);
// count를 업데이트하는 경로.
router.patch("/count/:counterId", counter_1.default.updateCount);
// count를 리셋하는 경로.
router.patch("/count/reset/:counterId/:resetFlag", counter_1.default.resetCount);
// achievementStack을 업데이트 하는 경로.
router.patch("/achievement-stack/:counterId", counter_1.default.updateAchievementStack);
// achievementStack을 리셋 하는 경로.
router.patch("/achievement-stack/reset/:counterId", counter_1.default.resetAchievementStack);
exports.default = router;
