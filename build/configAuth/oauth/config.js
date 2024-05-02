"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configJwtToken = void 0;
exports.configJwtToken = {
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 36000,
};
