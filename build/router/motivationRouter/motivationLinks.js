"use strict";
// 복수의 모티베이션 링크들에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const motivationLinks_1 = __importDefault(require("@/controller/controllers/motivationController/motivationLinks"));
// 모티베이션 링크들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationLinks_1.default.getMotivationLinkIds);
// 모티베이션 링크를 생성하기 위한 경로.
router.post("/:boxId", motivationLinks_1.default.createMotivationLink);
// 모티베이션 링크를 제거하기 위한 경로.
router.delete("/:boxId/:motivationLinkId", motivationLinks_1.default.removeMotivationLink);
exports.default = router;
