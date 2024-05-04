"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 접근 권한을 확인하는 인증 토큰으로 사용할 라이브러리.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = require("@/error/HttpError");
const errorWrapper_1 = require("@/error/errorWrapper");
const token_1 = require("@/config/authConfig/token");
// 접근 권한을 확인하는 미들웨어.
const confirmAuthorized = (req, _, next) => {
    const token = req.cookies.token;
    // 요청 쿠키 내 jwt 토큰이 존재하는지 확인.
    if (!token)
        throw new HttpError_1.HttpError(401, { message: "Request has no token" });
    const { userId } = jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
    // 요청한 유저가 보호된 라우터들에 대한 접근 권한을 가지고 있음을 확인하고, 해당 유저를 식별할 수 있는 id를 다음 미들웨어로 보냄.
    req.userId = userId;
    return next();
};
exports.default = (0, errorWrapper_1.errorWrapper)(confirmAuthorized);
