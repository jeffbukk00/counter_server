"use strict";
// 복수의 모티베이션 텍스트들에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const motivationTexts_1 = __importDefault(require("../../controller/controllers/motivationController/motivationTexts"));
// 모티베이션 텍스트들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationTexts_1.default.getMotivationTextIds);
// 모티베이션 텍스트를 생성하기 위한 경로.
router.post("/:boxId", motivationTexts_1.default.createMotivationText);
// 모티베이션 텍스트를 제거하기 위한 경로.
router.delete("/:boxId/:motivationTextId", motivationTexts_1.default.removeMotivationText);
exports.default = router;
