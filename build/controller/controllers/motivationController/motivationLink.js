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
// 단일 motivationLink를 가져오는 역할을 하는 컨트롤러.
const getMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 motivationLink의 id가 요청 패러미터에 저장.
    const { motivationLinkId } = req.params;
    // motivationLink를 DB로부터 쿼리.
    const motivationLink = yield (0, motivation_1.findMotivationLink)(motivationLinkId);
    return res.status(200).json({ motivationLink });
});
// motivationLink를 수정하는 역할을 하는 컨트롤러.
const editMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 수정 요청한 motivationLink의 id가 요청 패러미터에 저장.
    const { motivationLinkId } = req.params;
    // 수정 요청한 motivationLink를 DB로부터 쿼리.
    const motivationLink = yield (0, motivation_1.findMotivationLink)(motivationLinkId);
    // 요청의 body에 저장 된 업데이트 된 motivationLink의 데이터에 대한 유효성 검사.
    const { error } = (0, motivation_2.motivationLinkValidation)(req.body);
    // 요청의 body에 저장 된 업데이트 된 motivationLink의 데이터에 대한 유효성 검사가 실패하는 경우 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // motivationLink 수정.
    const { title, link } = req.body;
    motivationLink.title = title;
    motivationLink.link = link;
    // DB에 저장.
    yield motivationLink.save();
    return res.status(201).json({ message: "Edit motivation link successfully" });
});
exports.default = {
    getMotivationLink: (0, errorWrapper_1.errorWrapper)(getMotivationLink),
    editMotivationLink: (0, errorWrapper_1.errorWrapper)(editMotivationLink),
};
