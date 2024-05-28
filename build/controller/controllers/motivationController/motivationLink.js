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
const errorWrapper_1 = require("../../../error/errorWrapper");
const HttpError_1 = require("../../../error/HttpError");
const motivation_1 = require("../../../validation/motivation");
const motivation_2 = require("../../../controller/controllers/motivationController/controller-utils-not-shared/motivation");
// 단일 모티베이션 링크를 가져오는 역할을 하는 컨트롤러.
const getMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationLinkId } = req.params;
    // 모티베이션 링크를 가져옴.
    const motivationLink = yield (0, motivation_2.findMotivationLink)(motivationLinkId);
    return res.status(200).json({ motivationLink });
});
// 모티베이션 링크를 수정하는 역할을 하는 컨트롤러.
const editMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationLinkId } = req.params;
    // 모티베이션 링크를 가져옴.
    const motivationLink = yield (0, motivation_2.findMotivationLink)(motivationLinkId);
    // 모티베이션 링크 수정에 대한 유효성 검사.
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // 모티베이션 링크 수정 및 저장.
    const { title, link } = req.body;
    motivationLink.title = title;
    motivationLink.link = link;
    yield motivationLink.save();
    return res.status(201).json({ message: "Edit motivation link successfully" });
});
exports.default = {
    getMotivationLink: (0, errorWrapper_1.errorWrapper)(getMotivationLink),
    editMotivationLink: (0, errorWrapper_1.errorWrapper)(editMotivationLink),
};
