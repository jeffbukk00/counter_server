"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const kakao_1 = __importDefault(require("@/controller/authController/oauth/kakao"));
router.get("/oauth/url/kakao", kakao_1.default.getOauthUrlKakao);
router.post("/oauth/token/kakao", kakao_1.default.getAccessTokenKakao, kakao_1.default.loginUsingKakaoOauth);
exports.default = router;
