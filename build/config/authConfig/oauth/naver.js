"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenParamsNaver = exports.authParamsNaver = exports.configNaver = void 0;
const query_string_1 = __importDefault(require("query-string"));
const getNaverRedirectUri = () => {
    const mode = process.env.NODE_ENV;
    const dev = process.env.OAUTH_NAVER_REDIRECT_URL_DEV;
    const prod = process.env.OAUTH_NAVER_REDIRECT_URL_PROD;
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
exports.configNaver = {
    clientId: process.env.OAUTH_NAVER_CLIENT_ID,
    clientSecret: process.env.OAUTH_NAVER_CLIENT_SECRET,
    redirectUrl: getNaverRedirectUri(),
    authUrl: "https://nid.naver.com/oauth2.0/authorize",
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    profileUrl: "https://openapi.naver.com/v1/nid/me",
};
exports.authParamsNaver = query_string_1.default.stringify({
    client_id: exports.configNaver.clientId,
    redirect_uri: exports.configNaver.redirectUrl,
    response_type: "code",
});
const getTokenParamsNaver = (code, state) => query_string_1.default.stringify({
    client_id: exports.configNaver.clientId,
    client_secret: exports.configNaver.clientSecret,
    code,
    state,
    grant_type: "authorization_code",
    redirect_uri: exports.configNaver.redirectUrl,
});
exports.getTokenParamsNaver = getTokenParamsNaver;
