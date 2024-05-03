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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = require("@/validation/motivation");
const getMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationTextId } = req.params;
    const motivationText = yield motivationText_1.default.findOne({
        _id: motivationTextId,
    });
    if (!motivationText)
        throw new HttpError_1.HttpError(404, { message: "Motivation text not found" });
    return res.status(200).json({ motivationText });
});
const editMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { motivationTextId } = req.params;
    const motivationText = yield motivationText_1.default.findOne({
        _id: motivationTextId,
    });
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
exports.default = {
    getMotivationText: (0, errorWrapper_1.errorWrapper)(getMotivationText),
    editMotivationText: (0, errorWrapper_1.errorWrapper)(editMotivationText),
};
