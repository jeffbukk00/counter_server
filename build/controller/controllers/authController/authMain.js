"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const token_1 = require("@/config/authConfig/token");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// 유저의 로그인 여부를 확인하는 컨트롤러.
const checkLoggedIn = (req, res) => {
    try {
        // 요청의 Authorization 헤더 확인.
        const authorization = req.get("Authorization");
        // Authorization 헤더에 할당된 값이 없는 경우에 대한 에러 처리.
        if (!authorization)
            throw new HttpError_1.HttpError(400, { loggedIn: false });
        // Authorization 헤더에 토큰이 할당 되어 있는지 확인.
        const token = authorization.split(" ")[1];
        // Authorization 헤더에 토큰이 할당 되어 있지 않은 경우에 대한 에러 처리.
        if (!token)
            throw new HttpError_1.HttpError(400, { loggedIn: false });
        // 토큰 유효성 검사.
        jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
        return res.status(200).json({ loggedIn: true });
    }
    catch (err) {
        console.log(err);
        throw new HttpError_1.HttpError(400, { loggedIn: false });
    }
};
exports.checkLoggedIn = checkLoggedIn;
// 로그아웃에 대한 컨트롤러.
const logout = (req, res) => {
    // 업데이트 이전 로그인 방식에서는 쿠키 사용.
    // 업데이트 이후, 클라이언트 사이드의 로컬 스토리지를 활용. 클라이언트 사이드와 서버 사이드 간의 분리.
    // res
    //   .clearCookie("token", { httpOnly: false, secure: true, sameSite: "none" })
    //   .status(201)
    //   .json({ message: "Logged out" });
    res.status(201).json({ message: "Logged out" });
};
exports.logout = logout;
exports.default = {
    checkLoggedIn: (0, errorWrapper_1.errorWrapper)(exports.checkLoggedIn),
    logout: (0, errorWrapper_1.errorWrapper)(exports.logout),
};
