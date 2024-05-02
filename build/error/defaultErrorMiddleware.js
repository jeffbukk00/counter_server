"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultErrorMiddleware = void 0;
const defaultErrorMiddleware = (error, _1, res, _2) => {
    console.error(error);
    const status = error.status || 500;
    const errorResponse = error.errorResponse || {
        message: error.message || "Some error which has no error message occurred",
    };
    res.status(status).json(errorResponse);
};
exports.defaultErrorMiddleware = defaultErrorMiddleware;
