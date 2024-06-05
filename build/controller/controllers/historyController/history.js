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
const find_1 = require("@/controller/controller-utils-shared/find");
const errorWrapper_1 = require("@/error/errorWrapper");
const achievementStack_1 = __importDefault(require("@/model/logging/achievementStack"));
const history_1 = require("./controller-utils-not-shard/history");
const HttpError_1 = require("@/error/HttpError");
const getHistoryAll = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    const historyAll = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    }).populate("countHistory");
    res.status(200).json({ historyAll });
});
const getAchievementStackHistoryIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { counterId } = req.params;
    const counter = yield (0, find_1.findCounter)(counterId);
    return res
        .status(200)
        .json({ achievementStackHistoryIds: counter.achievementStackHistory });
});
const getAchievementStackHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { achievementStackId } = req.params;
    const achievementStack = yield (0, history_1.findAchievementStack)(achievementStackId);
    return res.status(200).json({
        achievementStack: {
            _id: achievementStack._id,
            stack: achievementStack.stack,
            comment: achievementStack.comment,
            timestamp: achievementStack.timeStamp,
        },
    });
});
const getCountHistoryAll = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { achievementStackId } = req.params;
    const achievementStack = yield achievementStack_1.default.findOne({
        _id: achievementStackId,
    }).populate("countHistory");
    if (!achievementStack)
        throw new HttpError_1.HttpError(404, {
            message: "cannot find requested achievement stack",
        });
    return res
        .status(200)
        .json({ countHistoryAll: achievementStack.countHistory });
});
const editCommentOfAchievementStackHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { achievementStackId } = req.params;
    const achievementStack = yield (0, history_1.findAchievementStack)(achievementStackId);
    const { updatedComment } = req.body;
    achievementStack.comment = updatedComment;
    yield achievementStack.save();
    return res
        .status(201)
        .json({ message: "Successfully edit achievement stack history" });
});
const editCommentOfCountHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { countId } = req.params;
    const count = yield (0, history_1.findCount)(countId);
    const { updatedComment } = req.body;
    count.comment = updatedComment;
    yield count.save();
    return res.status(201).json({ message: "Succesfully edit count history" });
});
exports.default = {
    getHistoryAll: (0, errorWrapper_1.errorWrapper)(getHistoryAll),
    getAchievementStackHistoryIds: (0, errorWrapper_1.errorWrapper)(getAchievementStackHistoryIds),
    getAchievementStackHistory: (0, errorWrapper_1.errorWrapper)(getAchievementStackHistory),
    getCountHistoryAll: (0, errorWrapper_1.errorWrapper)(getCountHistoryAll),
    editCommentOfAchievementStackHistory: (0, errorWrapper_1.errorWrapper)(editCommentOfAchievementStackHistory),
    editCommentOfCountHistory: (0, errorWrapper_1.errorWrapper)(editCommentOfCountHistory),
};
