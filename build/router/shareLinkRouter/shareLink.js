"use strict";
// 공유 링크에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const shareLink_1 = __importDefault(require("@/controller/controllers/shareLinkController/shareLink"));
// 공유 링크를 데이터베이스에 업로드(생성)하는 경로.
router.post("/upload", shareLink_1.default.uploadShareLink);
// 공유 링크로부터 버킷을 다운로드 하기 전, 이것의 유효성 및 안전성을 확인하기 위한 경로.
router.get("/:shareLinkId/validation", shareLink_1.default.validateShareLink);
// 공유 링크로부터 버킷을 다운로드 하는 경로.
router.post("/:shareLinkId/download/:downloadType", shareLink_1.default.downloadShareLink);
exports.default = router;
