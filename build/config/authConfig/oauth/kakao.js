"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenParamsKakao = exports.authParamsKakao = exports.configKakao = void 0;
const query_string_1 = __importDefault(require("query-string"));
exports.configKakao = {
    clientId: process.env.OAUTH_KAKAO_CLIENT_ID,
    clientSecret: process.env.OAUTH_KAKAO_CLIENT_SECRET,
    redirectUrl: process.env.OAUTH_KAKAO_REDIRECT_URL,
    authUrl: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    profileUrl: "https://kapi.kakao.com/v2/user/me",
};
exports.authParamsKakao = query_string_1.default.stringify({
    client_id: exports.configKakao.clientId,
    redirect_uri: exports.configKakao.redirectUrl,
    response_type: "code",
});
const getTokenParamsKakao = (code) => query_string_1.default.stringify({
    client_id: exports.configKakao.clientId,
    client_secret: exports.configKakao.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: exports.configKakao.redirectUrl,
});
exports.getTokenParamsKakao = getTokenParamsKakao;
