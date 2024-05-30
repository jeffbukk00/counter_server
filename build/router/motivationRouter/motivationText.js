"use strict";
// 단일 모티베이션 텍스트에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const motivationText_1 = __importDefault(require("@/controller/controllers/motivationController/motivationText"));
// 단일 모티베이션 텍스트를 가져오는 경로.
router.get("/:motivationTextId", motivationText_1.default.getMotivationText);
// 모티베이션 텍스트를 수정하는 경로.
router.put("/:motivationTextId", motivationText_1.default.editMotivationText);
exports.default = router;
