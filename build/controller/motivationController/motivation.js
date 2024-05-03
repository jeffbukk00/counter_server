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
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = require("@/validation/motivation");
const motivation_2 = __importDefault(require("@/constants/motivation"));
const getMotivation = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationType } = req.query;
    if (!motivationType || typeof motivationType !== "string")
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedMotivationType = parseInt(motivationType);
    if (parsedMotivationType !== motivation_2.default.motivationType.text &&
        parsedMotivationType !== motivation_2.default.motivationType.link)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const { motivationId } = req.params;
    const motivation = parsedMotivationType === motivation_2.default.motivationType.text
        ? yield motivationText_1.default.findOne({ _id: motivationId })
        : yield motivationLink_1.default.findOne({ _id: motivationId });
    if (!motivation)
        throw new HttpError_1.HttpError(404, { message: "Motivation not found" });
    return res.status(200).json({ motivation });
});
const editMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationId } = req.params;
    const motivationText = yield motivationText_1.default.findOne({ _id: motivationId });
    if (!motivationText)
        throw new HttpError_1.HttpError(404, "Motivation text not found");
    const { error } = (0, motivation_1.motivationTextValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { text } = req.body;
    motivationText.text = text;
    yield motivationText.save();
    return res.status(201).json({ message: "Edit motivation text successfully" });
});
const editMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationId } = req.params;
    const motivationLink = yield motivationLink_1.default.findOne({ _id: motivationId });
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
    getMotivation: (0, errorWrapper_1.errorWrapper)(getMotivation),
    editMotivationText: (0, errorWrapper_1.errorWrapper)(editMotivationText),
    editMotivationLink: (0, errorWrapper_1.errorWrapper)(editMotivationLink),
};
