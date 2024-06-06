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
exports.findCount = exports.findAchievementStack = void 0;
const HttpError_1 = require("@/error/HttpError");
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const count_1 = __importDefault(require("@/model/history/count"));
const findAchievementStack = (achieveStackId) => __awaiter(void 0, void 0, void 0, function* () {
    const achievementStack = yield achievementStack_1.default.findOne({
        _id: achieveStackId,
    });
    if (!achievementStack)
        throw new HttpError_1.HttpError(404, {
            message: "cannot find requested achievement stack",
        });
    return achievementStack;
});
exports.findAchievementStack = findAchievementStack;
const findCount = (countId) => __awaiter(void 0, void 0, void 0, function* () {
    const count = yield count_1.default.findOne({ _id: countId });
    if (!count)
        throw new HttpError_1.HttpError(404, { message: "cannot find requested count" });
    return count;
});
exports.findCount = findCount;
