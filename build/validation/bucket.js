"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucketValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const schema = joi_1.default.object({
    title: joi_1.default.string().max(20).required(),
});
const bucketValidation = (bucketData) => schema.validate(bucketData);
exports.bucketValidation = bucketValidation;
