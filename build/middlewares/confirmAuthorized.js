"use strict";
/*
  접근이 제한 된 라우터들에 대한 유저의 권한을 확인하는 미들웨어.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("@/config/authConfig/token");
const HttpError_1 = require("@/error/HttpError");
const errorWrapper_1 = require("@/error/errorWrapper");
const confirmAuthorized = (req, _, next) => {
    const authorization = req.get("Authorization");
    if (!authorization)
        throw new HttpError_1.HttpError(400, { loggedIn: false });
    const token = authorization.split(" ")[1];
    if (!token)
        throw new HttpError_1.HttpError(400, { loggedIn: false });
    const { userId } = jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
    // 요청한 유저가 보호된 라우터들에 대한 접근 권한을 가지고 있음을 확인하고, 해당 유저를 식별할 수 있는 id를 request 객체에 저장하여 다음 미들웨어로 보냄.
    req.userId = userId;
    return next();
};
exports.default = (0, errorWrapper_1.errorWrapper)(confirmAuthorized);
