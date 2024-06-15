"use strict";
// history에 대한 라우터
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_1 = __importDefault(require("@/controller/controllers/historyController/history"));
// 라우터 초기화.
const router = (0, express_1.Router)();
// counter에 속한 모든 history들을 가져오는 경로.
router.get("/all/:counterId", history_1.default.getHistoryAll);
// counter에 속한 모든 achievementStack의 id들을 가져오는 경로.
router.get("/achievement-stack/ids/:counterId", history_1.default.getAchievementStackHistoryIds);
// 단일 achievementStack을 가져오는 경로.
router.get("/achievement-stack/:achievementStackId", history_1.default.getAchievementStackHistory);
// achievementStack에 속한 모든 count들을 가져오는 경로.
router.get("/counts/:achievementStackId", history_1.default.getCountHistoryAll);
// achievementStack의 comment를 수정하는 경로.
router.patch("/achievement-stack/edit/:achievementStackId", history_1.default.editCommentOfAchievementStackHistory);
// count의 comment를 수정하는 경로.
router.patch("/count/edit/:countId", history_1.default.editCommentOfCountHistory);
exports.default = router;
