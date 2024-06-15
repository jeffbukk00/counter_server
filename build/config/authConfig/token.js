"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configJwtToken = void 0;
// JWT 토큰 발급 시 설정.
exports.configJwtToken = {
    tokenSecret: process.env.TOKEN_SECRET_KEY,
    tokenExpiration: 60 * 60 * 24 * 3,
};
