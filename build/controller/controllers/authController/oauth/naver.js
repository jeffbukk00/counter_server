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
const HttpError_1 = require("@/error/HttpError");
const errorWrapper_1 = require("@/error/errorWrapper");
const naver_1 = require("@/config/authConfig/oauth/naver");
const token_1 = require("@/config/authConfig/token");
const getOauthUrlNaver = (_, res) => {
    res.json({
        loginUrl: `${naver_1.configNaver.authUrl}?${naver_1.authParamsNaver}`,
    });
};
const getAccessTokenNaver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state } = req.query;
    if (!code)
        throw new HttpError_1.HttpError(400, {
            message: "Authorization code must be provided",
        });
    const tokenParam = (0, naver_1.getTokenParamsNaver)(code, state);
    const { data: { access_token }, } = yield axios_1.default.post(`${naver_1.configNaver.tokenUrl}?${tokenParam}`);
    if (!access_token)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    req.accessToken = access_token;
    return next();
});
const loginUsingNaverOauth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken } = req;
    if (!accessToken)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    const headers = { Authorization: "Bearer " + accessToken };
    const { data: { response: { id, email, nickname: name, profile_image: picture }, }, } = yield axios_1.default.get(naver_1.configNaver.profileUrl, {
        headers,
    });
    const snsId = id;
    const exUser = yield user_1.default.findOne({ snsId, provider: "naver" });
    let userId;
    if (exUser) {
        userId = exUser.id;
    }
    else {
        const newUser = new user_1.default({
            email,
            username: name,
            profilePictureUrl: picture,
            snsId,
            provider: "naver",
            bucketIds: [],
            unreadGuideIds: new Array(12)
                .fill(0)
                .map((_, i) => "guideId" + (i + 1).toString()),
        });
        yield newUser.save();
        userId = newUser.id;
    }
    const token = jsonwebtoken_1.default.sign({ userId }, token_1.configJwtToken.tokenSecret, {
        expiresIn: token_1.configJwtToken.tokenExpiration,
    });
    res.cookie("token", token, {
        maxAge: token_1.configJwtToken.tokenExpiration * 1000,
        httpOnly: true,
    });
    return res.status(201).json({ loggedIn: true });
});
exports.default = {
    getOauthUrlNaver: (0, errorWrapper_1.errorWrapper)(getOauthUrlNaver),
    getAccessTokenNaver: (0, errorWrapper_1.errorWrapper)(getAccessTokenNaver),
    loginUsingNaverOauth: (0, errorWrapper_1.errorWrapper)(loginUsingNaverOauth),
};
