"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenParamsGoogle = exports.authParamsGoogle = exports.configGoogle = void 0;
const query_string_1 = __importDefault(require("query-string"));
// 클라이언트에서 oauth를 위한 권한 토큰 발급 후, 리다이렉트 될 페이지의 URL 반환.
const getGoogleRedirectUri = () => {
    const mode = process.env.NODE_ENV;
    const dev = process.env.OAUTH_GOOGLE_REDIRECT_URL_DEV;
    const prod = process.env.OAUTH_GOOGLE_REDIRECT_URL_PROD;
    if (mode === "development") {
        return dev;
    }
    else if (mode === "production") {
        return prod;
    }
    else {
        return dev;
    }
};
// oauth를 위한 기본 설정.
exports.configGoogle = {
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    redirectUrl: getGoogleRedirectUri(),
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
};
// 플랫폼 로그인 페이지를 요청하는 URL.
exports.authParamsGoogle = query_string_1.default.stringify({
    client_id: exports.configGoogle.clientId,
    redirect_uri: exports.configGoogle.redirectUrl,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    state: "standard_oauth",
    prompt: "consent",
});
// 플랫폼에 엑세스 토큰 발급 요청을 할 때의 요청 파라미터 반환.
const getTokenParamsGoogle = (code) => query_string_1.default.stringify({
    client_id: exports.configGoogle.clientId,
    client_secret: exports.configGoogle.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: exports.configGoogle.redirectUrl,
});
exports.getTokenParamsGoogle = getTokenParamsGoogle;
