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
exports.findMotivationLink = exports.findMotivationText = void 0;
/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  단일 motivation 관련.
*/
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const HttpError_1 = require("@/error/HttpError");
// motivationText를 가져오는 함수.
const findMotivationText = (motivationTextId) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationText를 DB로부터 쿼리.
    const motivationText = yield motivationText_1.default.findOne({
        _id: motivationTextId,
    });
    // motivationText가 존재하지 않는 경우 에러 처리.
    if (!motivationText)
        throw new HttpError_1.HttpError(404, { message: "Motivation text not found" });
    return motivationText;
});
exports.findMotivationText = findMotivationText;
// motivationLink를 가져오는 함수.
const findMotivationLink = (motivationLinkId) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationLink를 DB로부터 쿼리.
    const motivationLink = yield motivationLink_1.default.findOne({
        _id: motivationLinkId,
    });
    // motivationLink가 존재하지 않는 경우 에러 처리.
    if (!motivationLink)
        throw new HttpError_1.HttpError(404, { message: "Motivation link not found" });
    return motivationLink;
});
exports.findMotivationLink = findMotivationLink;
