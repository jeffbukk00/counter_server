"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUpdateValidation = exports.counterEditValidation = exports.counterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const counter_1 = __importDefault(require("@/constants/counter"));
const schema = joi_1.default.object({
    title: joi_1.default.string().max(15).required(),
    startCount: joi_1.default.number().min(0).max(999999).required(),
    endCount: joi_1.default.number()
        .min(0)
        .max(999999)
        .disallow(joi_1.default.ref("startCount"))
        .required(),
});
const counterValidation = (counterData) => schema.validate(counterData);
exports.counterValidation = counterValidation;
const counterEditValidation = (direction, startCount, currentCount, endCount) => {
    if (typeof direction !== "number" ||
        typeof startCount !== "number" ||
        typeof currentCount !== "number" ||
        typeof endCount !== "number")
        return null;
    if (direction === counter_1.default.direction.up) {
        return currentCount >= startCount && currentCount <= endCount;
    }
    else {
        return currentCount <= startCount && currentCount >= endCount;
    }
};
exports.counterEditValidation = counterEditValidation;
const countUpdateValidation = (direction, startCount, updatedCurrentCount, endCount) => {
    if (typeof direction !== "number" ||
        typeof startCount !== "number" ||
        typeof updatedCurrentCount !== "number" ||
        typeof endCount !== "number")
        return null;
    if (direction === counter_1.default.direction.up) {
        return updatedCurrentCount >= startCount && updatedCurrentCount <= endCount;
    }
    else {
        return updatedCurrentCount <= startCount && updatedCurrentCount >= endCount;
    }
};
exports.countUpdateValidation = countUpdateValidation;
