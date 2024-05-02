"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const naver_1 = __importDefault(require("@/controller/authController/oauth/naver"));
router.get("/oauth/url/naver", naver_1.default.getOauthUrlNaver);
router.post("/oauth/token/naver", naver_1.default.getAccessTokenNaver, naver_1.default.loginUsingNaverOauth);
exports.default = router;
