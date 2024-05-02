"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const google_1 = __importDefault(require("@/controller/authController/oauth/google"));
router.get("/oauth/url/google", google_1.default.getOauthUrlGoogle);
router.post("/oauth/token/google", google_1.default.getAccessTokenGoogle, google_1.default.loginUsingGoogleOauth);
exports.default = router;
