"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_1 = __importDefault(require("@/controller/controllers/historyController/history"));
const router = (0, express_1.Router)();
router.get("/all/:counterId", history_1.default.getHistoryAll);
router.get("/achievement-stack/ids/:counterId", history_1.default.getAchievementStackHistoryIds);
router.get("/achievement-stack/:achievementStackId", history_1.default.getAchievementStackHistory);
router.get("/counts/:achievementStackId", history_1.default.getCountHistoryAll);
router.patch("/achievement-stack/edit/:achievementStackId", history_1.default.editCommentOfAchievementStackHistory);
router.patch("/count/edit/:countId", history_1.default.editCommentOfCountHistory);
exports.default = router;
