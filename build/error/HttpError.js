"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, errorResponse) {
        super();
        this.status = status;
        this.errorResponse = errorResponse;
    }
}
exports.HttpError = HttpError;
