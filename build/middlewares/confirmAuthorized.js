"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpError_1 = require("@/error/HttpError");
const errorWrapper_1 = require("@/error/errorWrapper");
const token_1 = require("@/config/authConfig/token");
const confirmAuthorized = (req, _, next) => {
    const token = req.cookies.token;
    if (!token)
        throw new HttpError_1.HttpError(401, { message: "Request has no token" });
    const { userId } = jsonwebtoken_1.default.verify(token, token_1.configJwtToken.tokenSecret);
    req.userId = userId;
    return next();
};
exports.default = (0, errorWrapper_1.errorWrapper)(confirmAuthorized);
