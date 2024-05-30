"use strict";
// Google Oauth에 대한 라우터.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 라우터 초기화
const express_1 = require("express");
const router = (0, express_1.Router)();
// 해당 라우터에 대한 컨트롤러들.
const google_1 = __importDefault(require("@/controller/controllers/authController/oauth/google"));
// 유저 동의 페이지에 대한 URL을 가져오는 경로.
// "이 어플리케이션에 구글 아이디로 로그인할 것인지 및 명시된 개인정보들을 제공하는데 동의 하는지"에 대한 유저 동의 페이지.
router.get("/oauth/url/google", google_1.default.getOauthUrlGoogle);
// 두가지의 컨트롤러.
//  1. "getAccessTokenGoogle" => 유저로부터 전달 된 권한 토큰으로 구글 인증 서버에 엑세스 토큰을 요청하는 역할.
//  2. "loginUsingGoogleOauth" => 구글 인증 서버로부터 엑세스 토큰을 성공적으로 발급 받은 후, 구글 리소스 서버에 유저 프로필 데이터를 요청하는 역할.
router.post("/oauth/token/google", google_1.default.getAccessTokenGoogle, google_1.default.loginUsingGoogleOauth);
exports.default = router;
