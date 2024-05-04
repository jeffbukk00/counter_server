"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.checkLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const token_1 = require("@/config/authConfig/token");
const checkLoggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token)
            throw new HttpError_1.HttpError(400, { loggedIn: false });
        const { userId } = jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
        const newToken = jsonwebtoken_1.default.sign({ userId }, token_1.configJwtToken.tokenSecret, {
            expiresIn: token_1.configJwtToken.tokenExpiration,
        });
        res.cookie("token", newToken, {
            maxAge: token_1.configJwtToken.tokenExpiration * 1000,
            httpOnly: true,
        });
        res.status(200).json({ loggedIn: true });
    }
    catch (err) {
        throw new HttpError_1.HttpError(400, { loggedIn: false });
    }
};
exports.checkLoggedIn = checkLoggedIn;
const logout = (_, res) => {
    res.clearCookie("token").status(201).json({ message: "Logged out" });
};
exports.logout = logout;
exports.default = {
    checkLoggedIn: (0, errorWrapper_1.errorWrapper)(exports.checkLoggedIn),
    logout: (0, errorWrapper_1.errorWrapper)(exports.logout),
};
