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
const user_1 = __importDefault(require("../../../../model/user"));
const HttpError_1 = require("../../../../error/HttpError");
const errorWrapper_1 = require("../../../../error/errorWrapper");
const google_1 = require("../../../../config/authConfig/oauth/google");
const token_1 = require("../../../../config/authConfig/token");
const getOauthUrlGoogle = (_, res) => {
    res.json({
        loginUrl: `${google_1.configGoogle.authUrl}?${google_1.authParamsGoogle}`,
    });
};
const getAccessTokenGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { code } = req.query;
    if (!code)
        throw new HttpError_1.HttpError(400, {
            message: "Authorization code must be provided",
        });
    const tokenParam = (0, google_1.getTokenParamsGoogle)(code);
    const { data: { access_token }, } = yield axios_1.default.post(`${google_1.configGoogle.tokenUrl}?${tokenParam}`);
    if (!access_token)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    req.accessToken = access_token;
    return next();
});
const loginUsingGoogleOauth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken } = req;
    if (!accessToken)
        throw new HttpError_1.HttpError(400, { message: "Cannot get access token" });
    const headers = { Authorization: "Bearer " + accessToken };
    const { data: { id, email, name, picture }, } = yield axios_1.default.get(google_1.configGoogle.profileUrl, {
        headers,
    });
    const snsId = id;
    const exUser = yield user_1.default.findOne({ snsId, provider: "google" });
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
            provider: "google",
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
    getOauthUrlGoogle: (0, errorWrapper_1.errorWrapper)(getOauthUrlGoogle),
    getAccessTokenGoogle: (0, errorWrapper_1.errorWrapper)(getAccessTokenGoogle),
    loginUsingGoogleOauth: (0, errorWrapper_1.errorWrapper)(loginUsingGoogleOauth),
};
