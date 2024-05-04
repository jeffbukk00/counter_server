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
exports.downloadMotivationLinks = exports.downloadMotivationTexts = exports.findShareLink = void 0;
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const shareLink_1 = __importDefault(require("@/model/shareLink"));
const HttpError_1 = require("@/error/HttpError");
const findShareLink = (shareLinkId, errorResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const shareLink = yield shareLink_1.default.findOne({ _id: shareLinkId });
    // 요청 파라미터에 포함된 share link id에 해당 되는 공유 링크가 존재하지 않는 다면, 404 에러 throw
    if (!shareLink)
        throw new HttpError_1.HttpError(404, errorResponse);
    return shareLink;
});
exports.findShareLink = findShareLink;
const downloadMotivationTexts = (motivationTexts) => __awaiter(void 0, void 0, void 0, function* () {
    const insertedMotivationTexts = yield motivationText_1.default.insertMany(motivationTexts.map((e) => {
        return { text: e.text };
    }));
    const motivationTextIds = [...insertedMotivationTexts].map((e) => e._id);
    return motivationTextIds;
});
exports.downloadMotivationTexts = downloadMotivationTexts;
const downloadMotivationLinks = (motivationLinks) => __awaiter(void 0, void 0, void 0, function* () {
    const insertedMotivationLinks = yield motivationLink_1.default.insertMany(motivationLinks.map((e) => {
        return { title: e.title, link: e.link };
    }));
    const motivationLinkIds = [...insertedMotivationLinks].map((e) => e._id);
    return motivationLinkIds;
});
exports.downloadMotivationLinks = downloadMotivationLinks;
