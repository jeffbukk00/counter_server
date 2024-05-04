"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBox = exports.validateBoxType = void 0;
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = __importDefault(require("@/constants/motivation"));
// 모티베이션들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별하는 함수.
const validateBoxType = (boxType) => {
    //  1. query string 내 "boxType" 필드가 비어 있지 않은지.
    if (!boxType)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedBoxType = parseInt(boxType);
    //  2. query string 내 "boxType" 필드에 할당 된 값이 미리 지정 된 box의 type들에 해당하는지.
    if (parsedBoxType !== motivation_1.default.boxType.bucket &&
        parsedBoxType !== motivation_1.default.boxType.counter)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    return parsedBoxType;
};
exports.validateBoxType = validateBoxType;
// 박스 타입(버킷 혹은 카운터)에 따라, 버킷 혹은 카운터를 가져오는 함수.
const findBox = (boxId, parsedBoxType) => __awaiter(void 0, void 0, void 0, function* () {
    const box = parsedBoxType === motivation_1.default.boxType.bucket
        ? yield bucket_1.default.findOne({ _id: boxId })
        : yield counter_1.default.findOne({ _id: boxId });
    if (!box)
        throw new HttpError_1.HttpError(404, { message: "Box not found" });
    return box;
});
exports.findBox = findBox;
