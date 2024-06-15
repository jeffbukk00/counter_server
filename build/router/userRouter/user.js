"use strict";
// 인증된 유저에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const user_1 = __importDefault(require("@/controller/controllers/userController/user"));
// 유저 데이터를 가져오는 경로.
router.get("/user-data", user_1.default.getUserData);
// 유저 프로필을 업데이트하는 경로. => 추후 업데이트 예정.
// router.patch("/user-data/user-profile", userController.updateUserProfile);
// 유저 가이드를 업데이트 하는 경로.
router.patch("/user-data/unread-guide-ids", user_1.default.updateUnreadGuideIds);
exports.default = router;
