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
// motivationLink들의 id를 가져오는 역할을 하는 컨트롤러.
const getMotivationLinkIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 motivationLink들을 참조하는 박스의 타입에 대한 정보가 요청 패러미터에 저장.
    const { boxType } = req.query;
    // motivationLink들을 저장하는 박스의 타입(bucket 혹은 counter) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // 요청한 motivationLink들을 참조하는 박스의 id가 요청 패러미터에 저장.
    const { boxId } = req.params;
    // motivationLink들의 id를 참조하는 박스(bucket 혹은 counter)를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
});
// motivationLink를 생성하는 역할을 하는 컨트롤러.
const createMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationLink를 생성할 박스의 타입(bucket 혹은 counter)에 대한 정보가 요청 패러미터에 저장.
    const { boxType } = req.query;
    // motivationLink를 생성할 박스의 타입(bucket 혹은 counter) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // motivationLink를 생성할 박스의 id를 요청 패러미터에 저장.
    const { boxId } = req.params;
    // motivationLink를 생성할 박스를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 요청의 body에 저장된 motivationLink 생성을 위한 데이터에 대한 유효성 검사.
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    // 요청의 body에 저장된 motivationLink 생성을 위한 데이터에 대한 유효성 검사가 실패할 경우 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // motivationLink 생성.
    const { title, link } = req.body;
    const newMotivationLink = new motivationLink_1.default({
        title,
        link,
    });
    // DB에 저장.
    yield newMotivationLink.save();
    // 박스가 참조하는 motivationLink들이 담긴 배열에 생성 된 motivationLink 추가.
    box.motivationLinkIds.push(newMotivationLink._id);
    // DB에 저장.
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation link successfully" });
});
// motivationLink를 제거하는 컨트롤러
const removeMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 제거할 motivationLink를 참조하는 박스의 타입(bucket 혹은 counter)에 대한 정보가 요청 패러미터에 저장.
    const { boxType } = req.query;
    // motivationLink를 생성할 박스의 타입(bucket 혹은 counter) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // 제거할 motivationLink의 id와 이를 참조하는 박스의 id가 요청 패러미터에 저장.
    const { boxId, motivationLinkId } = req.params;
    // 제거할 motivationLink를 참조하는 박스를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // motivationLink 제거.
    yield motivationLink_1.default.deleteOne({ _id: motivationLinkId });
    // 박스가 참조하는 motivaitonLink들이 담긴 배열에서 제거 된 motivationLink를 필터링.
    box.motivationLinkIds = [...box.motivationLinkIds].filter((e) => e.toString() !== motivationLinkId);
    // DB에 저장.
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
