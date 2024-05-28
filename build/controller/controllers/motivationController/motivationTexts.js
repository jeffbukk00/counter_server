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
const motivationText_1 = __importDefault(require("../../../model/motivation/motivationText"));
const errorWrapper_1 = require("../../../error/errorWrapper");
const HttpError_1 = require("../../../error/HttpError");
const motivation_1 = require("../../../validation/motivation");
const motivations_1 = require("../../../controller/controllers/motivationController/controller-utils-not-shared/motivations");
// 모티베이션 텍스트들의 id를 가져오기 위한 컨트롤러.
const getMotivationTextIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const { boxId } = req.params;
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationTextIds: box.motivationTextIds });
});
// 모티베이션 텍스트를 생성하기 위한 컨트롤러.
const createMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 모티베이션 텍스트 생성에 대한 유효성 검사.
    const { error } = (0, motivation_1.motivationTextValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // 모티베이션 텍스트 생성 및 저장.
    const { text } = req.body;
    const newMotivationText = new motivationText_1.default({
        text,
    });
    yield newMotivationText.save();
    // 생성 된 모티베이션 텍스트를 참조하는 박스(버킷 혹은 카운터) 업데이트 및 저장.
    box.motivationTextIds.push(newMotivationText._id);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation text successfully" });
});
// 모티베이션 텍스트를 제거하기 위한 컨트롤러.
const removeMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId, motivationTextId } = req.params;
    // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    // 모티베이션 텍스트 제거.
    yield motivationText_1.default.deleteOne({ _id: motivationTextId });
    // 제거 된 모티베이션 텍스를 참조하는 박스(버킷 혹은 카운터) 업데이트 및 저장.
    box.motivationTextIds = [...box.motivationTextIds].filter((e) => e.toString() !== motivationTextId);
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
