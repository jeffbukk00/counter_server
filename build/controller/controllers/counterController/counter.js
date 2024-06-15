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
const count_1 = __importDefault(require("@/model/history/count"));
const find_1 = require("@/controller/controller-utils-shared/find");
const history_1 = require("../historyController/controller-utils-not-shared/history");
const counter_1 = require("@/validation/counter");
const counter_2 = __importDefault(require("@/constants/counter"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// counter 하나의 데이터를 요청하는 컨트롤러.
const getCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    return res.status(200).json({ counter });
});
// counter를 수정하는 컨트롤러.
const editCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // counter 수정을 요청하는 데이터에 대한 유효성 검사.
    const { error } = (0, counter_1.counterValidation)(req.body);
    // counter 수정을 요청하는 데이터에 대한 유효성 검사가 실패할 경우 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // 요청의 body로부터 업데이터 할 counter의 데이터들을 가져옴.
    const { title, startCount, endCount } = req.body;
    // 업데이트 된 startCount와 endCount로부터 해당 counter의 direction을 다시 판단 및 업데이트.
    const direction = startCount < endCount
        ? counter_2.default.direction.up
        : counter_2.default.direction.down;
    // 기존의 currentCount와 업데이트 된 startCount와 endCount 사이의 관계에 대한 유효성 검사.
    const counterEditValidationResult = (0, counter_1.counterEditValidation)(direction, counter.startCount, counter.currentCount, counter.endCount);
    // 기존의 currentCount와 업데이트 된 startCount와 endCount 사이의 관계에 대한 유효성 검사가 실패하는 경우 에러 처리.
    if (!counterEditValidationResult && counterEditValidationResult === false)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    // counter의 데이터 업데이트.
    counter.title = title;
    counter.startCount = startCount;
    counter.endCount = endCount;
    counter.direction = direction;
    // DB에 저장.
    yield counter.save();
    return res.status(201).json({ message: "Edit counter successfully" });
});
// counter의 count를 업데이트 하는 컨트롤러.
// counter model의 인스턴스의 "currentCount" 필드 뿐만 아니라, 의존 관계를 가지고 있는 AchievementStack과 Count model의 인스턴스들도 여기서 업데이트.
const updateCount = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    /*
      <단계 분리>
      
      1. Counter model의 인스턴스의 "currentCount" 필드를 업데이트
    */
    // 요청한 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // 요청의 body에 업데이트 된 currentCount가 저장.
    const { updatedCurrentCount } = req.body;
    // 업데이트 된 currentCount가 counter의 기존 currentCount와 같은 경우, 요청 무효화.
    if (counter.currentCount === updatedCurrentCount)
        return res.status(201).json({ message: "Update count successfully" });
    // 업데이트 된 currentCount에 대한 유효성 검사.
    const countUpdateValidationResult = (0, counter_1.countUpdateValidation)(counter.direction, counter.startCount, updatedCurrentCount, counter.endCount);
    // 업데이트 된 currentCount에 대한 유효성 검사가 실패하는 경우 에러 처리.
    if (!countUpdateValidationResult && countUpdateValidationResult === false)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    /*
     ---------------------------------------------------------------------------------------------------------------------
      <단계 분리>
      
      2. AchievementStack model과 Count model의 인스턴스를 업데이트.
    */
    // counter가 현재 진행 중인 achievementStack을 DB로부터 쿼리.
    const currentAchievementStack = yield achievementStack_1.default.findOne({
        _id: counter.achievementStackHistory[counter.achievementStackHistory.length - 1],
    });
    // counter가 현재 진행 중인 achievementStack가 없는 상황에 대한 에러 처리.
    if (!currentAchievementStack)
        throw new HttpError_1.HttpError(404, {
            message: "cannot find achievement history which this count belongs to",
        });
    // currentCount의 변화량.
    const offset = updatedCurrentCount - counter.currentCount;
    console.log(offset);
    // currentCount의 변화량의 부호.
    const sign = Math.sign(offset);
    // currentCount의 변화량, currentCount의 변화량의 부호, counter의 direction의 관계를 고려하여 Count model의 인스턴스 생성 및 저장.
    if (sign > 0) {
        if (counter.direction === counter_2.default.direction.up) {
            // positive한 currentCount의 변화인가? => counter의 direction이 "up"이고, currentCount의 변화량의 부호가 "+"인 경우. => positive
            // currentCount를 reset하였는가? => 아니다. 단순 업데이트.
            // 판별된 타입들에 맞추어 Count model의 인스턴스 생성.
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: true,
                isResetHistory: false,
                comment: "",
                timestamp: new Date(),
            });
            // 현재 진행 중인 achievementStack의 countHistory에 push.
            currentAchievementStack.countHistory.push(newCountHistory._id);
            // DB에 저장.
            newCountHistory.save();
        }
        else {
            // 위와 절차가 같다.
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: false,
                isResetHistory: false,
                comment: "",
                timestamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
    }
    else {
        if (counter.direction === counter_2.default.direction.up) {
            // 위와 절차가 같다.
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: false,
                isResetHistory: false,
                comment: "",
                timestamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
        else {
            // 위와 절차가 같다.
            const newCountHistory = new count_1.default({
                offset,
                updatedCurrentCount,
                isPositive: true,
                isResetHistory: false,
                comment: "",
                timestamp: new Date(),
            });
            currentAchievementStack.countHistory.push(newCountHistory._id);
            newCountHistory.save();
        }
    }
    // counter의 currentCount 필드 업데이트.
    counter.currentCount = updatedCurrentCount;
    // DB에 저장.
    yield currentAchievementStack.save();
    yield counter.save();
    return res.status(201).json({ message: "Update count successfully" });
});
// counter의 count를 리셋하는 컨트롤러.
// counter model의 인스턴스의 "currentCount" 필드 뿐만 아니라, 의존 관계를 가지고 있는 AchievementStack과 Count model의 인스턴스들도 여기서 업데이트.
const resetCount = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    /*
      <단계 분리>
      
      1. Counter model의 인스턴스의 "currentCount" 필드를 업데이트
    */
    // 요청한 counter의 id와 resetFlag가 요청 패러미터에 저장.
    // resetFlag는 count를 리셋하는 상황이 두가지이므로, 이 둘을 구별하기 위해 사용 됨.
    const { counterId, resetFlag } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // 이미 counter의 currentCount가 초기 상태라면, 요청 무효화.
    if (counter.currentCount === counter.startCount)
        return res.status(201).json({ mesasge: "Reset count successfully" });
    /*
     ---------------------------------------------------------------------------------------------------------------------
      <단계 분리>
      
      2. AchievementStack model과 Count model의 인스턴스를 업데이트.
    */
    // counter의 currentCount 필드만 업데이트하는 경우와, AchievementStack과 Count model의 인스턴스들까지 업데이트 해야하는 경우가 나누어짐.
    if (resetFlag === counter_2.default.resetFlag.resetHistroy) {
        //AchievementStack과 Count model의 인스턴스들까지 업데이트 해야하는 경우
        // 현재 진행 중인 achievementStack을 DB로부터 쿼리.
        const currentAchievementStack = yield achievementStack_1.default.findOne({
            _id: counter.achievementStackHistory[counter.achievementStackHistory.length - 1],
        });
        // 현재 진행 중인 achievementStack가 없는 경우 에러 처리.
        if (!currentAchievementStack)
            throw new HttpError_1.HttpError(404, {
                message: "cannot find achievement history which this count belongs to",
            });
        // count 리셋에 대한 Counter model의 인스턴스 생성
        // negative
        const newResetCountHistory = new count_1.default({
            offset: counter.startCount - counter.currentCount,
            updatedCurrentCount: counter.startCount,
            isPositive: false,
            isResetHistory: true,
            comment: "",
            timestamp: new Date(),
        });
        // 현재 진행 중인 achievementStack의 couuntHistory에 추가.
        currentAchievementStack.countHistory.push(newResetCountHistory.id);
        // DB에 저장.
        yield newResetCountHistory.save();
        yield currentAchievementStack.save();
    }
    // counter의 currentCount 필드를 리셋.
    counter.currentCount = counter.startCount;
    // DB에 저장.
    yield counter.save();
    return res.status(201).json({ mesasge: "Reset count successfully" });
});
// achievementStack을 업데이트하는 컨트롤러.
// Counter model의 "achievementStack" 필드 뿐만 아니라, 의존 관계를 가지고 있는 AchievementStack model의 인스턴스들도 여기서 업데이트.
const updateAchievementStack = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    /*
      <단계 분리>
      
      1. Counter model의 인스턴스의 "achievementStack" 필드를 업데이트
    */
    // 요청한 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // 요청의 body에 업데이트 된 achievementStack이 저장.
    const { updatedAchievementStack } = req.body;
    // 업데이트 된 achievementStack이 0보다 작을 경우 에러 처리.
    if (updatedAchievementStack < 0)
        throw new HttpError_1.HttpError(400, { message: "Invalid input from client side" });
    /*
     ---------------------------------------------------------------------------------------------------------------------
      <단계 분리>
      
      2. AchievementStack model의 인스턴스를 업데이트.
    */
    // 성취 된 achievementStack을 DB로부터 쿼리.
    const achieved = yield (0, history_1.findAchievementStack)(counter.achievementStackHistory[counter.achievementStackHistory.length - 1].toString());
    // 성취 된 achievementStack 업데이트.
    achieved.isAchieved = true;
    achieved.achievedAt = new Date();
    // 새로운 achievementStack 생성.
    const newAchievementHistory = new achievementStack_1.default({
        isAchieved: false,
        stack: updatedAchievementStack,
        comment: "",
        countHistory: [],
        createdAt: new Date(),
        achievedAt: null,
    });
    // counter의 achievementStack 필드 업데이트.
    counter.achievementStack = updatedAchievementStack;
    // counter의 achievementStackHistory에 새로운 achievementStack을 추가.
    counter.achievementStackHistory.push(newAchievementHistory._id);
    // DB에 저장.
    yield achieved.save();
    yield newAchievementHistory.save();
    yield counter.save();
    return res
        .status(201)
        .json({ message: "Update achievement stack successfully" });
});
// achievementStack을 리셋하는 컨트롤러.
// Counter model의 "achievementStack" 필드 뿐만 아니라, 의존 관계를 가지고 있는 AchievementStack model의 인스턴스들도 여기서 업데이트.
const resetAchievementStack = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    /*
      <단계 분리>
      
      1. Counter model의 인스턴스의 "achievementStack" 필드를 리셋.
    */
    // 요청한 counter의 id가 요청 패러미터에 저장.
    const { counterId } = req.params;
    // 요청한 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // 이미 counter의 achievementStack이 초기 상태라면, 요청 무효화.
    if (counter.achievementStackHistory.length <= 1)
        return res
            .status(201)
            .json({ message: "Reset achievement stack successfully" });
    /*
     ---------------------------------------------------------------------------------------------------------------------
      <단계 분리>
      
      2. AchievementStack model의 인스턴스를 업데이트.
    */
    let achievementStackHistoryIds = [...counter.achievementStackHistory];
    // counter가 참조하고 있는 모든 achievementStack들을 쿼리.
    let achievementStackHistory = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    });
    // 마지막 achievementStack은 현재 진행 중인 achievementStack이므로, 삭제하지 않고 유지.
    const lastHistory = achievementStackHistory.pop();
    // 마지막 achievementStack을 첫번째 achievementStack으로 업데이트.
    lastHistory.stack = 0;
    const lastHistoryId = achievementStackHistoryIds.pop();
    // counter가 참조하는 achievementStack들의 배열을 비움.
    counter.achievementStackHistory = [];
    // 마지막 achievementStack에 대한 참조만 저장.
    counter.achievementStackHistory.push(lastHistoryId);
    // 나머지 achievementStack들이 참조하는 Count model의 인스턴스들을 전부 DB에서 삭제.
    for (const e of achievementStackHistory) {
        yield count_1.default.deleteMany({ _id: { $in: e.countHistory } });
    }
    // 나머지 achievementStack들을 전부 DB에서 삭제.
    yield achievementStack_1.default.deleteMany({
        _id: { $in: achievementStackHistoryIds },
    });
    // counter의 achievementStack 필드 리셋.
    counter.achievementStack = 0;
    // DB에 저장.
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
