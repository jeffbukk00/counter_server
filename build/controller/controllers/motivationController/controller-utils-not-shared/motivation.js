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
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const HttpError_1 = require("@/error/HttpError");
// 모티베이션 텍스트를 가져오는 함수.
const findMotivationText = (motivationTextId) => __awaiter(void 0, void 0, void 0, function* () {
    const motivationText = yield motivationText_1.default.findOne({
        _id: motivationTextId,
    });
    if (!motivationText)
        throw new HttpError_1.HttpError(404, { message: "Motivation text not found" });
    return motivationText;
});
exports.findMotivationText = findMotivationText;
// 모티베이션 링크를 가져오는 함수.
const findMotivationLink = (motivationLinkId) => __awaiter(void 0, void 0, void 0, function* () {
    const motivationLink = yield motivationLink_1.default.findOne({
        _id: motivationLinkId,
    });
    if (!motivationLink)
        throw new HttpError_1.HttpError(404, { message: "Motivation link not found" });
    return motivationLink;
});
exports.findMotivationLink = findMotivationLink;
