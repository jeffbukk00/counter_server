"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const counter_1 = __importDefault(require("@/controller/counterController/counter"));
router.get("/:counterId", counter_1.default.getCounter);
router.put("/:counterId", counter_1.default.editCounter);
router.patch("/count/:counterId", counter_1.default.updateCount);
router.patch("/count/reset/:counterId", counter_1.default.resetCount);
router.patch("/achievement-stack/:counterId", counter_1.default.updateAchievementStack);
router.patch("/achievement-stack/reset/:counterId", counter_1.default.resetAchievementStack);
exports.default = router;
