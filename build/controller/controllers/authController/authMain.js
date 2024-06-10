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
        const authorization = req.get("Authorization");
        if (!authorization)
            throw new HttpError_1.HttpError(400, { loggedIn: false });
        const token = authorization.split(" ")[1];
        if (!token)
            throw new HttpError_1.HttpError(400, { loggedIn: false });
        // const { userId } = jwt.verify(token, configJwtToken.tokenSecret) as any;
        // const newToken = jwt.sign({ userId }, configJwtToken.tokenSecret, {
        //   expiresIn: configJwtToken.tokenExpiration,
        // });
        jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
        return res.status(200).json({ loggedIn: true });
    }
    catch (err) {
        console.log(err);
        throw new HttpError_1.HttpError(400, { loggedIn: false });
    }
};
exports.checkLoggedIn = checkLoggedIn;
const logout = (req, res) => {
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
