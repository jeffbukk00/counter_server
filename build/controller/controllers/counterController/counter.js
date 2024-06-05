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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const counter_1 = require("@/validation/counter");
const counter_2 = __importDefault(require("@/constants/counter"));
const find_1 = require("@/controller/controller-utils-shared/find");
const achievementStack_1 = __importDefault(require("@/model/logging/achievementStack"));
const count_1 = __importDefault(require("@/model/logging/count"));
const getCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    return res.status(200).json({ counter });
});
const editCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    const { error } = (0, counter_1.counterValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title, startCount, endCount } = req.body;
    const direction = startCount < endCount
        ? counter_2.default.direction.up
        : counter_2.default.direction.down;
    counter.title = title;
    counter.startCount = startCount;
    counter.endCount = endCount;
    counter.direction = direction;
    const counterEditValidationResult = (0, counter_1.counterEditValidation)(counter.direction, counter.startCount, counter.currentCount, counter.endCount);
    if (!counterEditValidationResult && counterEditValidationResult === false)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    yield counter.save();
    return res.status(201).json({ message: "Edit counter successfully" });
});
const updateCount = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    const { updatedCurrentCount } = req.body;
    const countUpdateValidationResult = (0, counter_1.countUpdateValidation)(counter.direction, counter.startCount, updatedCurrentCount, counter.endCount);
    if (!countUpdateValidationResult && countUpdateValidationResult === false)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    if (counter.currentCount === updatedCurrentCount)
        return res.status(201).json({ message: "Update count successfully" });
    const currentAchievementStack = yield achievementStack_1.default.findOne({
        _id: counter.achievementStackHistory[counter.achievementStackHistory.length - 1],
    });
    if (!currentAchievementStack)
        throw new HttpError_1.HttpError(404, {
            message: "cannot find achievement history which this count belongs to",
        });
    const offset = updatedCurrentCount - counter.currentCount;
    const sign = Math.sign(offset);
    if (sign > 0) {
        if (counter.direction === counter_2.default.direction.up) {
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: true,
                isResetHistory: false,
                comment: "",
                timeStamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
        else {
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: false,
                isResetHistory: false,
                comment: "",
                timeStamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
    }
    else {
        if (counter.direction === counter_2.default.direction.up) {
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: false,
                isResetHistory: false,
                comment: "",
                timeStamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
        else {
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: true,
                isResetHistory: false,
                comment: "",
                timeStamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
    }
    yield currentAchievementStack.save();
    counter.currentCount = updatedCurrentCount;
    yield counter.save();
    return res.status(201).json({ message: "Update count successfully" });
});
const resetCount = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId, resetFlag } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    if (counter.currentCount === counter.startCount)
        return res.status(201).json({ mesasge: "Reset count successfully" });
    if (resetFlag === counter_2.default.resetFlag.resetHistroy) {
        const currentAchievementStack = yield achievementStack_1.default.findOne({
            _id: counter.achievementStackHistory[counter.achievementStackHistory.length - 1],
        });
        if (!currentAchievementStack)
            throw new HttpError_1.HttpError(404, {
                message: "cannot find achievement history which this count belongs to",
            });
        const newResetCountHistory = new count_1.default({
            offset: counter.startCount - counter.currentCount,
            updatedCurrentCount: counter.startCount,
            isPositive: false,
            isResetHistory: true,
            comment: "",
            timeStamp: new Date(),
        });
        currentAchievementStack.countHistory.push(newResetCountHistory.id);
        yield newResetCountHistory.save();
        yield currentAchievementStack.save();
    }
    counter.currentCount = counter.startCount;
    yield counter.save();
    return res.status(201).json({ mesasge: "Reset count successfully" });
});
const updateAchievementStack = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    const { updatedAchievementStack } = req.body;
    if (updatedAchievementStack < 0)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    const newAchievementHistory = new achievementStack_1.default({
        stack: updatedAchievementStack,
        comment: "",
        countHistory: [],
        timeStamp: new Date(),
    });
    counter.achievementStack = updatedAchievementStack;
    counter.achievementStackHistory.push(newAchievementHistory._id);
    yield newAchievementHistory.save();
    yield counter.save();
    return res
        .status(201)
        .json({ message: "Update achievement stack successfully" });
});
const resetAchievementStack = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    if (counter.achievementStackHistory.length <= 1)
        return res
            .status(201)
            .json({ message: "Reset achievement stack successfully" });
    let achievementStackHistoryIds = [...counter.achievementStackHistory];
    let achievementStackHistory = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    });
    const lastHistory = achievementStackHistory.pop();
    lastHistory.stack = 0;
    const lastHistoryId = achievementStackHistoryIds.pop();
    counter.achievementStack = 0;
    counter.achievementStackHistory = [];
    counter.achievementStackHistory.push(lastHistoryId);
    for (const e of achievementStackHistory) {
        yield count_1.default.deleteMany({ _id: { $in: e.countHistory } });
    }
    yield achievementStack_1.default.deleteMany({
        _id: { $in: achievementStackHistoryIds },
    });
    yield (lastHistory === null || lastHistory === void 0 ? void 0 : lastHistory.save());
    yield counter.save();
    return res
        .status(201)
        .json({ message: "Reset achievement stack successfully" });
});
exports.default = {
    getCounter: (0, errorWrapper_1.errorWrapper)(getCounter),
    editCounter: (0, errorWrapper_1.errorWrapper)(editCounter),
    updateCount: (0, errorWrapper_1.errorWrapper)(updateCount),
    resetCount: (0, errorWrapper_1.errorWrapper)(resetCount),
    updateAchievementStack: (0, errorWrapper_1.errorWrapper)(updateAchievementStack),
    resetAchievementStack: (0, errorWrapper_1.errorWrapper)(resetAchievementStack),
};
