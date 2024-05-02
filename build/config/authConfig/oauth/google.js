"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenParamsGoogle = exports.authParamsGoogle = exports.configGoogle = void 0;
const query_string_1 = __importDefault(require("query-string"));
exports.configGoogle = {
    clientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
    redirectUrl: process.env.OAUTH_GOOGLE_REDIRECT_URL,
    authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo",
};
exports.authParamsGoogle = query_string_1.default.stringify({
    client_id: exports.configGoogle.clientId,
    redirect_uri: exports.configGoogle.redirectUrl,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    state: "standard_oauth",
    prompt: "consent",
});
const getTokenParamsGoogle = (code) => query_string_1.default.stringify({
    client_id: exports.configGoogle.clientId,
    client_secret: exports.configGoogle.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: exports.configGoogle.redirectUrl,
});
exports.getTokenParamsGoogle = getTokenParamsGoogle;
