"use strict";
// Oauth를 제외한 인증 로직을 위한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화.
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const authMain_1 = __importDefault(require("@/controller/controllers/authController/authMain"));
// 로그인 여부를 확인하는 경로.
router.get("/logged-in", authMain_1.default.checkLoggedIn);
// 로그아웃을 하기 위한 경로.
router.post("/logout", authMain_1.default.logout);
exports.default = router;
