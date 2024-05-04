"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketValidation = void 0;
// 유효성 검사를 위한 라이브러리.
const joi_1 = __importDefault(require("joi"));
// 버킷 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정
//  1. "title" 필드 => 타입 string / 15자 이하 / 필수 입력
const schema = joi_1.default.object({
    title: joi_1.default.string().max(15).required(),
});
// 버킷 생성 및 편집에 대한 유효성 검사를 실행하는 함수
const bucketValidation = (bucketData) => schema.validate(bucketData);
exports.bucketValidation = bucketValidation;
