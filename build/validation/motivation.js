"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.motivationLinkValidation = exports.motivationTextValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const motivationTextSchema = joi_1.default.object({
    text: joi_1.default.string().required(),
});
const motivationLinkSchema = joi_1.default.object({
    title: joi_1.default.string().max(15).required(),
    link: joi_1.default.string().required(),
});
const motivationTextValidation = (motivationTextData) => motivationTextSchema.validate(motivationTextData);
exports.motivationTextValidation = motivationTextValidation;
const motivationLinkValidation = (motivationLinkData) => motivationLinkSchema.validate(motivationLinkData);
exports.motivationLinkValidation = motivationLinkValidation;
