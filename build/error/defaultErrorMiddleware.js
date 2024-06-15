"use strict";
/*
 어플리케이션 내 모든 에러들을 중앙 처리하는 기본 에러 처리 미들웨어.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorMiddleware = void 0;
const defaultErrorMiddleware = (error, _1, res, _2) => {
    console.error(error);
    console.error(error.message);
    const status = error.status || 500;
    const errorResponse = error.errorResponse || {
        message: error.message || "Some error which has no error message occurred",
    };
    res.status(status).json(errorResponse);
};
exports.defaultErrorMiddleware = defaultErrorMiddleware;
