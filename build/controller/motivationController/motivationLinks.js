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
const motivations_1 = require("./controller-utils-not-shared/motivations");
// 모티베이션 링크들의 id를 가져오는 역할을 하는 컨트롤러.
const getMotivationLinkIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
});
// 모티베이션 링크를 생성하는 역할을 하는 컨트롤러.
const createMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 전달 된 모티베이션 링크 데이터에 대한 유효성 검사 진행.
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    // 유효성 검사를 실패한다면, 400 에러를 throw.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title, link } = req.body;
    const newMotivationLink = new motivationLink_1.default({
        title,
        link,
    });
    yield newMotivationLink.save();
    // 새롭게 생성된 모티베이션 링크의 id를 박스(버킷 혹은 카운터)에 추가한 뒤, 저장.
    box.motivationLinkIds.push(newMotivationLink._id);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation link successfully" });
});
const removeMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId, motivationLinkId } = req.params;
    // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    yield motivationLink_1.default.deleteOne({ _id: motivationLinkId });
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
