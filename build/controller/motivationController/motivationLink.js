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
const getMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationLinkId } = req.params;
    const motivationLink = yield motivationLink_1.default.findOne({
        _id: motivationLinkId,
    });
    if (!motivationLink)
        throw new HttpError_1.HttpError(404, { message: "Motivation link not found" });
    return res.status(200).json({ motivationLink });
});
const editMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationLinkId } = req.params;
    const motivationLink = yield motivationLink_1.default.findOne({
        _id: motivationLinkId,
    });
    if (!motivationLink)
        throw new HttpError_1.HttpError(404, "Motivation link not found");
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
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
