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
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = require("@/validation/motivation");
const motivations_1 = require("@/controller/controllers/motivationController/controller-utils-not-shared/motivations");
// 모티베이션 링크들의 id를 가져오는 역할을 하는 컨트롤러.
const getMotivationLinkIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
});
// 모티베이션 링크를 생성하는 역할을 하는 컨트롤러.
const createMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 모티베이션 링크 생성에 대한 유효성 검사 진행.
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // 모티베이션 링크 생성 및 저장.
    const { title, link } = req.body;
    const newMotivationLink = new motivationLink_1.default({
        title,
        link,
    });
    yield newMotivationLink.save();
    // 생성 된 모티베이션 링크를 참조하는 박스(버킷 혹은 카운터) 업데이트.
    box.motivationLinkIds.push(newMotivationLink._id);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation link successfully" });
});
// 모티베이션 링크를 제거하는 컨트롤러
const removeMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId, motivationLinkId } = req.params;
    // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 모티베이션 링크 제거.
    yield motivationLink_1.default.deleteOne({ _id: motivationLinkId });
    // 제거 된 모티베이션 링크를 참조하는 박스(버킷 혹은 카운터) 업데이트.
    box.motivationLinkIds = [...box.motivationLinkIds].filter((e) => e.toString() !== motivationLinkId);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Delete motivation link successfully" });
});
exports.default = {
    getMotivationLinkIds: (0, errorWrapper_1.errorWrapper)(getMotivationLinkIds),
    createMotivationLink: (0, errorWrapper_1.errorWrapper)(createMotivationLink),
    removeMotivationLink: (0, errorWrapper_1.errorWrapper)(removeMotivationLink),
};
