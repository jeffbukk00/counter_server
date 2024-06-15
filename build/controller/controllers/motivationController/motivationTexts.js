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
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivation_1 = require("@/validation/motivation");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivations_1 = require("@/controller/controllers/motivationController/controller-utils-not-shared/motivations");
// 박스가 참조하는 모든 motivationText들의 id를 가져오는 컨트롤러.
const getMotivationTextIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 motivationText들을 참조하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
    const { boxType } = req.query;
    // 요청한 motivationText들을 참조하는 박스의 타입(bucket or counter)를 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // 요청한 motivationText들을 참조하는 박스의 id를 요청 패러미터에 저장.
    const { boxId } = req.params;
    // 요청한 motivationText들을 참조하는 박스를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationTextIds: box.motivationTextIds });
});
// motivationText를 생성하기 위한 컨트롤러.
const createMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationText을 생성하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
    const { boxType } = req.query;
    // motivationText를 생성 요청한 박스의 타입(bucket or counter)를 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // motivationText를 생성 요청한 박스의 id를 요청 패러미터에 저장.
    const { boxId } = req.params;
    //  motivationText를 생성 요청한 박스를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 요청의 body에 저장된 motivationText 생성을 위한 데이터에 대한 유효성 검사.
    const { error } = (0, motivation_1.motivationTextValidation)(req.body);
    // 요청의 body에 저장된 motivationText 생성을 위한 데이터에 대한 유효성 검사 실패 시 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // motivationText 생성.
    const { text } = req.body;
    const newMotivationText = new motivationText_1.default({
        text,
    });
    // motivationText 저장.
    yield newMotivationText.save();
    // 박스가 참조하는 motivationText들을 담고 있는 배열에 생성 된 motivationText에 대한 참조를 추가.
    box.motivationTextIds.push(newMotivationText._id);
    // DB에 저장.
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation text successfully" });
});
// motivationText를 제거하기 위한 컨트롤러.
const removeMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 제거할 motivationText를 참조하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
    const { boxType } = req.query;
    // 제거할 motivationText를 참조하는 박스의 타입(bucket or counter) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // 제거할 motivationText의 id와 이를 참조하는 박스의 id를 요청 패러미터에 저장.
    const { boxId, motivationTextId } = req.params;
    // 제거할 motivationText를 참조하는 박스를 DB로부터 쿼리.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // motivationText 제거.
    yield motivationText_1.default.deleteOne({ _id: motivationTextId });
    // 박스가 참조하는 motivationText들을 담은 배열에서 삭제 된 motivationText를 필터링.
    box.motivationTextIds = [...box.motivationTextIds].filter((e) => e.toString() !== motivationTextId);
    // DB에 저장.
    yield box.save();
    return res
        .status(201)
        .json({ message: "Delete motivation text successfully" });
});
exports.default = {
    getMotivationTextIds: (0, errorWrapper_1.errorWrapper)(getMotivationTextIds),
    createMotivationText: (0, errorWrapper_1.errorWrapper)(createMotivationText),
    removeMotivationText: (0, errorWrapper_1.errorWrapper)(removeMotivationText),
};
