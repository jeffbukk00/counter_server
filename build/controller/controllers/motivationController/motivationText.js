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
Object.defineProperty(exports, "__esModule", { value: true });
const motivation_1 = require("@/controller/controllers/motivationController/controller-utils-not-shared/motivation");
const motivation_2 = require("@/validation/motivation");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// 단일 motivationText를 가져오는 컨트롤러.
const getMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 motivationText의 id가 요청 패러미터에 저장.
    const { motivationTextId } = req.params;
    // 요청한 motivationText를 DB로부터 쿼리.
    const motivationText = yield (0, motivation_1.findMotivationText)(motivationTextId);
    return res.status(200).json({ motivationText });
});
// motivationText를 수정하는 컨트롤러.
const editMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 수정 요청한 motivationText의 id를 요청 패러미터에 저장.
    const { motivationTextId } = req.params;
    // 수정 요청한 motivationText를 DB로부터 쿼리.
    const motivationText = yield (0, motivation_1.findMotivationText)(motivationTextId);
    // 요청의 body에 저장 된 수정을 위해 업데이트 된 motivationText 데이터에 대한 유효성 검사.
    const { error } = (0, motivation_2.motivationTextValidation)(req.body);
    // 요청의 body에 저장 된 수정을 위해 업데이트 된 motivationText 데이터에 대한 유효성 검사 실패 시 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // motivationText 수정.
    const { text } = req.body;
    motivationText.text = text;
    // DB에 저장.
    yield motivationText.save();
    return res.status(201).json({ message: "Edit motivation text successfully" });
});
exports.default = {
    getMotivationText: (0, errorWrapper_1.errorWrapper)(getMotivationText),
    editMotivationText: (0, errorWrapper_1.errorWrapper)(editMotivationText),
};
