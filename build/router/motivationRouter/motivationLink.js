"use strict";
// 단일 모티베이션 링크에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const motivationLink_1 = __importDefault(require("../../controller/controllers/motivationController/motivationLink"));
// 단일 모티베이션 링크를 가져오는 경로.
router.get("/:motivationLinkId", motivationLink_1.default.getMotivationLink);
// 모티베이션 링크를 수정하는 경로.
router.put("/:motivationLinkId", motivationLink_1.default.editMotivationLink);
exports.default = router;
