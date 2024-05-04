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
// 요청의 query string으로 전달 된 boxType에 대한 유효성 검사.
const validateBoxType = (boxType) => {
    //  1. boxType이 query string 내에 존재하는지
    if (!boxType)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedBoxType = parseInt(boxType);
    //  2. 요청의 query string으로 전달 된 boxType이 미리 지정 된 box의 type에 해당하는지.
    if (parsedBoxType !== motivation_1.default.boxType.bucket &&
        parsedBoxType !== motivation_1.default.boxType.counter)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    return parsedBoxType;
};
exports.validateBoxType = validateBoxType;
const findBox = (boxId, parsedBoxType) => __awaiter(void 0, void 0, void 0, function* () {
    // 전달 된 boxType에 따라 버킷을 가져올 지, 카운터를 가져올 지 결정.
    const box = parsedBoxType === motivation_1.default.boxType.bucket
        ? yield bucket_1.default.findOne({ _id: boxId })
        : yield counter_1.default.findOne({ _id: boxId });
    // 요청 파라미터로 전달 된 box id에 해당하는 버킷 및 카운터가 존재하지 않는다면, 404 에러를 throw.
    if (!box)
        throw new HttpError_1.HttpError(404, { message: "Box not found" });
    return box;
});
exports.findBox = findBox;
