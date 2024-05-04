"use strict";
// 어플리케이션 내에서 사용 되는 모든 미들웨어들에 대한 에러 처리를 위한 wrapper.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorWrapper = void 0;
/**
 * 감싼 미들웨어에서 throw된 에러들을 catch하여, 중앙 에러 처리 경로로 보낸다.
 * @param cb : 어플리케이션 내에서 사용되는 모든 미들웨어들.
 * @returns : cb에서 throw되는 에러들을 처리하는 역할을 하는 wrapper로 감싼 뒤 반환.
 */
const errorWrapper = (cb) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield cb(req, res, next);
        }
        catch (error) {
            if (error instanceof Error)
                return next(error);
        }
    });
};
exports.errorWrapper = errorWrapper;
