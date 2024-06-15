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
exports.findShareLink = void 0;
/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  shareLink 관련.
*/
const shareLink_1 = __importDefault(require("@/model/shareLink"));
const HttpError_1 = require("@/error/HttpError");
// shareLink를 가져오는 함수.
const findShareLink = (shareLinkId, errorResponse) => __awaiter(void 0, void 0, void 0, function* () {
    // shareLink를 DB로부터 쿼리.
    const shareLink = yield shareLink_1.default.findOne({ _id: shareLinkId });
    // 존재하지 않는 shareLink에 대한 에러 처리.
    if (!shareLink)
        throw new HttpError_1.HttpError(404, errorResponse);
    return shareLink;
});
exports.findShareLink = findShareLink;
