"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("@/model/user"));
const kakao_1 = require("@/config/authConfig/oauth/kakao");
const token_1 = require("@/config/authConfig/token");
const HttpError_1 = require("@/error/HttpError");
const errorWrapper_1 = require("@/error/errorWrapper");
// 플랫폼 로그인 페이지 URL을 요청하는 요청에 대한 컨트롤러.
const getOauthUrlKakao = (_, res) => {
    res.json({
        loginUrl: `${kakao_1.configKakao.authUrl}?${kakao_1.authParamsKakao}`,
    });
};
// 플랫폼 로그인 페이지에서 로그인을 완료한 유저의 정보에 접근할 권한을 부여하는 엑세스 토큰 발급을 위한 컨트롤러.
const getAccessTokenKakao = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청 패러미터에 저장 된 권한 토큰.
    // 엑세스 토큰 발급 시 사용 됨.
    const { code } = req.query;
    // 저장된 권한 토큰이 없는 경우에 대한 에러 처리.
    if (!code)
        throw new HttpError_1.HttpError(400, {
            message: "Authorization code must be provided",
        });
    // 플랫폼의 인증 서버에 엑세스 토큰을 요청하는 요청의 패러미터.
    const tokenParam = (0, kakao_1.getTokenParamsKakao)(code);
    // 플랫폼의 인증 서버에 엑세스 토큰을 요청하는 요청의 헤더.
    const headers = {
        headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
    };
    // 플랫폼의 인증 서버로 보내는 엑세스 토큰 발급 요청.
    const { data: { access_token }, } = yield axios_1.default.post(`${kakao_1.configKakao.tokenUrl}?${tokenParam}`, { headers });
    // 엑세스 토큰 발급 실패 시, 에러 처리.
    if (!access_token)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    // request 객체에 발급한 엑세스 토큰 저장.
    req.accessToken = access_token;
    return next();
});
// 발급 받은 엑세스 토큰을 활용하여 플랫폼 인증 서버에 유저 데이터 요청, 이를 활용하여 유저 생성. 그리고 로그인을 위한 jwt 토큰을 발급하는 컨트롤러.
const loginUsingKakaoOauth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // request 객체에 저장 된 엑세스 토큰.
    const { accessToken } = req;
    // request 객체에 저장 된 엑세스 토큰이 없는 경우에 대한 에러 처리.
    if (!accessToken)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    // 플랫폼 인증 서버로 유저 데이터를 요청하는 요청의 헤더.
    const headers = {
        Authorization: "Bearer " + accessToken,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    };
    // 플랫폼 인증 서버로 유저 데이터를 요청.
    const { data: { id, properties: { nickname: name, thumbnail_image: picture }, }, } = yield axios_1.default.get(kakao_1.configKakao.profileUrl, {
        headers,
    });
    const snsId = id;
    const exUser = yield user_1.default.findOne({ snsId, provider: "kakao" });
    let userId;
    if (exUser) {
        // 이미 존재하는 유저가 로그인 한 경우.
        userId = exUser.id;
    }
    else {
        // 새로운 유저가 로그인한 경우.
        // 플랫폼 인증 서버로부터 응답 받은 유저 데이터를 활용하여 새로운 유저 생성 및 DB에 저장.
        const newUser = new user_1.default({
            // 테스트 어플리케이션 상태에서는 유저 이메일 요청 불가. 비즈니스 어플리케이션으로의 전환 필요. 사전 심사 받아야 함.
            email: "",
            username: name,
            profilePictureUrl: picture,
            snsId,
            provider: "kakao",
            bucketIds: [],
            unreadGuideIds: new Array(13)
                .fill(0)
                .map((_, i) => "guideId" + (i + 1).toString()),
        });
        yield newUser.save();
        userId = newUser.id;
    }
    // 유저에 대한 jwt 토큰 발급.
    const token = jsonwebtoken_1.default.sign({ userId }, token_1.configJwtToken.tokenSecret, {
        expiresIn: token_1.configJwtToken.tokenExpiration,
    });
    return res.status(201).json({ loggedIn: true, token });
});
exports.default = {
    getOauthUrlKakao: (0, errorWrapper_1.errorWrapper)(getOauthUrlKakao),
    getAccessTokenKakao: (0, errorWrapper_1.errorWrapper)(getAccessTokenKakao),
    loginUsingKakaoOauth: (0, errorWrapper_1.errorWrapper)(loginUsingKakaoOauth),
};
