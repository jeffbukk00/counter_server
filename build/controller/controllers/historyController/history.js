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
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const find_1 = require("@/controller/controller-utils-shared/find");
const history_1 = require("./controller-utils-not-shared/history");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// 모든 history(achievementStack, count)들을 가져오는 컨트롤러.
const getHistoryAll = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // history를 참조하는 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // history를 참조하는 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // counter가 참조하는 모든 achievementStack들을 DB로부터 쿼리.
    // 각 achievementStack이 참조하는 count들을 populate(join).
    const historyAll = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    }).populate("countHistory");
    res.status(200).json({ historyAll });
});
// counter에 속한 모든 achievementStack (history)들의 id를 가져오는 컨트롤러.
const getAchievementStackHistoryIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 achievementStack들을 참조하는 counter의 id를 요청 패러미터에 저장.
    const { counterId } = req.params;
    //요청한 achievementStack들을 참조하는 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    return res
        .status(200)
        .json({ achievementStackHistoryIds: counter.achievementStackHistory });
});
// achievementStack 하나를 가져오는 컨트롤러.
const getAchievementStackHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 achievementStack의 id를 요청 패러미터에 저장.
    const { achievementStackId } = req.params;
    // 요청한 achievementStack을 DB로부터 쿼리.
    const achievementStack = yield (0, history_1.findAchievementStack)(achievementStackId);
    // achievementStack이 참조하는 가장 최근에 업데이트 된 count의 id.
    // 최근 업데이트 시간을 구하기 위함.
    const lastCountId = achievementStack.countHistory[achievementStack.countHistory.length - 1];
    // 응답할 achievementStack의 데이터를 반환하는 함수.
    let achievementStackData = (lastestCountAt) => ({
        _id: achievementStack._id,
        isAchieved: achievementStack.isAchieved,
        stack: achievementStack.stack,
        comment: achievementStack.comment,
        createdAt: achievementStack.createdAt,
        achievedAt: achievementStack.achievedAt,
        latestCountAt: lastestCountAt,
    });
    if (lastCountId) {
        // 최근에 업데이트한 count가 하나라도 있다면 DB로부터 쿼리.
        const recentCount = yield (0, history_1.findCount)(achievementStack.countHistory[achievementStack.countHistory.length - 1].toString());
        // 최근 업데이트 정보를 담아서 응답.
        return res.status(200).json({
            achievementStack: achievementStackData(recentCount.timestamp),
        });
    }
    // // 최근 업데이트 정보가 없는 상태에서 응답.
    return res.status(200).json({
        achievementStack: achievementStackData(null),
    });
});
// achievementStack이 참조하는 모든 count들을 가져오는 컨트롤러.
const getCountHistoryAll = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 count들을 참조하는 achievementStack의 id가 요청 패러미터에 저장.
    const { achievementStackId } = req.params;
    // 요청한 count들을 참조하는 achievementStack를 DB로부터 쿼리.
    // achievementStack이 참조하는 모든 count들을 populate(join).
    const achievementStack = yield achievementStack_1.default.findOne({
        _id: achievementStackId,
    }).populate("countHistory");
    // achievementStack이 존재하지 않는 경우 에러 처리.
    if (!achievementStack)
        throw new HttpError_1.HttpError(404, {
            message: "cannot find requested achievement stack",
        });
    return res
        .status(200)
        .json({ countHistoryAll: achievementStack.countHistory });
});
// achievementStack의 comment를 수정하는 컨트롤러.
const editCommentOfAchievementStackHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // comment 수정 요청한 achievementStack의 id를 요청 패러미터에 저장.
    const { achievementStackId } = req.params;
    // comment 수정 요청한 achievementStack를 DB로부터 쿼리.
    const achievementStack = yield (0, history_1.findAchievementStack)(achievementStackId);
    // 업데이트 된 comment가 요청의 body에 저장.
    const { updatedComment } = req.body;
    // achievementStack의 comment를 업데이트.
    achievementStack.comment = updatedComment;
    // DB에 저장.
    yield achievementStack.save();
    return res
        .status(201)
        .json({ message: "Successfully edit achievement stack history" });
});
// count의 comment를 수정하는 컨트롤러.
const editCommentOfCountHistory = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // comment 수정 요청한 count의 id를 요청 패러미터에 저장.
    const { countId } = req.params;
    // comment 수정 요청한 count를 DB로부터 쿼리.
    const count = yield (0, history_1.findCount)(countId);
    // 업데이트 된 comment가 요청의 body에 저장.
    const { updatedComment } = req.body;
    // count의 comment를 업데이트.
    count.comment = updatedComment;
    // DB에 저장.
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
