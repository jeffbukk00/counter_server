"use strict";
/*
  이 어플리케이션 내에서 사용하는 에러 객체의 형식.
*/
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
