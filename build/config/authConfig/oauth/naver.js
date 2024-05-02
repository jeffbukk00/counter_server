"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenParamsNaver = exports.authParamsNaver = exports.configNaver = void 0;
const query_string_1 = __importDefault(require("query-string"));
exports.configNaver = {
    clientId: process.env.OAUTH_NAVER_CLIENT_ID,
    clientSecret: process.env.OAUTH_NAVER_CLIENT_SECRET,
    redirectUrl: process.env.OAUTH_NAVER_REDIRECT_URL,
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
