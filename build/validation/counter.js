"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUpdateValidation = exports.counterEditValidation = exports.counterValidation = void 0;
// 유효성 검사를 위한 라이브러리.
const joi_1 = __importDefault(require("joi"));
// 카운터와 관련된 상수들.
const counter_1 = __importDefault(require("@/constants/counter"));
// 버킷 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정.
//  1. "title" 필드 => 타입 string / 15자 이하 / 필수 입력
//  2. "startCount" 필드 => 타입 number / 최소 0 / 최대 999,999 / 필수 입력
//  3. "endCount" 필드 => 타입 number /  최소 0 / 최대 999,9999 / "startCount" 필드와 값이 같이 않아야 함. / 필수 입력
const schema = joi_1.default.object({
    title: joi_1.default.string().max(15).required(),
    startCount: joi_1.default.number().min(0).max(999999).required(),
    endCount: joi_1.default.number()
        .min(0)
        .max(999999)
        .disallow(joi_1.default.ref("startCount"))
        .required(),
});
// 버킷 생성 및 편집에 대한 유효성 검사를 실행하는 함수.
const counterValidation = (counterData) => schema.validate(counterData);
exports.counterValidation = counterValidation;
// 카운터 업데이트 시, 변경 된 "startCount" 필드의 값과 "endCount" 필드의 값 사이에 기존 "currentCurrent" 필드의 값이 존재하는지에 대한 유효성 검사를 실행하는 함수.
const counterEditValidation = (direction, startCount, currentCount, endCount) => {
    if (typeof direction !== "number" ||
        typeof startCount !== "number" ||
        typeof currentCount !== "number" ||
        typeof endCount !== "number")
        return null;
    if (direction === counter_1.default.direction.up) {
        return currentCount >= startCount && currentCount <= endCount;
    }
    else {
        return currentCount <= startCount && currentCount >= endCount;
    }
};
exports.counterEditValidation = counterEditValidation;
// 카운터의 카운트("currentCount" 필드) 업데이트 시, 변경 된 "currentCount" 필드의 값이 기존 "startCount" 필드의 값과 "endCount" 필드의 값 사이에 존재하는지에 대한 유효성 검사를 실행하는 함수.
const countUpdateValidation = (direction, startCount, updatedCurrentCount, endCount) => {
    if (typeof direction !== "number" ||
        typeof startCount !== "number" ||
        typeof updatedCurrentCount !== "number" ||
        typeof endCount !== "number")
        return null;
    if (direction === counter_1.default.direction.up) {
        return updatedCurrentCount >= startCount && updatedCurrentCount <= endCount;
    }
    else {
        return updatedCurrentCount <= startCount && updatedCurrentCount >= endCount;
    }
};
exports.countUpdateValidation = countUpdateValidation;
