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
const counter_1 = __importDefault(require("@/model/counter"));
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const find_1 = require("@/controller/controller-utils-shared/find");
const remove_1 = require("@/controller/controller-utils-shared/remove");
const duplicate_1 = require("@/controller/controller-utils-shared/duplicate");
const counter_2 = require("@/validation/counter");
const counter_3 = __importDefault(require("@/constants/counter"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// bucket이 참조하는 모든 counter들의 id들을 가져오는 컨트롤러.
const getCounterIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 counter들을 참조하는 bucket의 id를 요청 패러미터에 저장.
    const { bucketId } = req.params;
    // 요청한 counter들을 참조하는 bucket을 DB로부터 쿼리.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    return res.status(200).json({ counterIds: bucket.counterIds });
});
// counter의 위치를 바꾸는 요청에 대한 컨트롤러.
// 여기서 말하는 위치란, 클라이언트 화면 상에 보여지는 counter의 순서를 의미.
const changeCounterPosition = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 counter들을 참조하는 bucket의 id가 요청 패러미터에 저장.
    const { bucketId } = req.params;
    // 요청의 body에 순서가 업데이트 된 counter들의 id 배열이 저장.
    const { counterIds } = req.body;
    // 요청한 counter들을 참조하는 bucket을 DB로부터 쿼리.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    // counter들의 id를 담고 있는 배열을 업데이트.
    bucket.counterIds = counterIds;
    //DB에 저장.
    yield bucket.save();
    return res
        .status(201)
        .json({ message: "Change counter's position successfully" });
});
// counter를 생성하는 컨트롤러.
const createCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // counter가 생성 될 bucket의 id가 요청 패러미터에 저장.
    const { bucketId } = req.params;
    // counter가 생성 될 bucket을 DB로부터 쿼리.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    // 요청의 body에 할당 된 카운터 생성을 위한 데이터들의 유효성 검사.
    const { error } = (0, counter_2.counterValidation)(req.body);
    // 카운터 생성을 위한 데이터들의 유효성 검사가 실패할 경우 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title, startCount, endCount } = req.body;
    // startCount와 endCount에 따라 counter의 direction 판별.
    const direction = startCount < endCount
        ? counter_3.default.direction.up
        : counter_3.default.direction.down;
    // counter가 참조하는 최초의 achievementStack 생성.
    const initialAchievementHistory = new achievementStack_1.default({
        isAchieved: false,
        stack: 0,
        comment: "",
        countHistory: [],
        createdAt: new Date(),
        achievedAt: null,
    });
    // counter 생성.
    // 최초의 achievementStack에 대한 참조를 저장.
    const newCounter = new counter_1.default({
        title,
        startCount,
        currentCount: startCount,
        endCount,
        direction,
        achievementStack: 0,
        achievementStackHistory: [initialAchievementHistory],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    // DB에 저장.
    yield initialAchievementHistory.save();
    yield newCounter.save();
    // bucket에 생성 된 counter에 대한 참조를 저장한 뒤, DB에 저장.
    bucket.counterIds.push(newCounter._id);
    yield bucket.save();
    return res.status(201).json({ message: "Create counter successfully" });
});
// counter를 복제하는 컨트롤러.
const duplicateCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 복제할 counter를 참조하는 bucket의 id와 복제할 counter의 id가 요쳥 패러미터에 저장.
    const { bucketId, counterId } = req.params;
    // 복제할 counter를 참조하는 bucket을 DB로부터 쿼리.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    // 복제할 counter를 DB로부터 쿼리.
    // 복제할 counter가 참조하는 모든 motivation들을 populate(join).
    const counter = yield counter_1.default.findOne({ _id: counterId }).populate("motivationTextIds motivationLinkIds", "-_id");
    // counter가 존재하지 않는 경우 에러 처리.
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
    // 복제할 counter의 데이터 정리
    // 기존 counter의 모든 motivations.
    // 기존 counter의 currentCount, achievementStack 초기화.
    const counterData = {
        title: counter.title,
        startCount: counter.startCount,
        endCount: counter.endCount,
        direction: counter.direction,
        motivationTexts: counter._doc.motivationTextIds,
        motivationLinks: counter._doc.motivationLinkIds,
    };
    let updatedCounterIds = [...bucket.counterIds];
    // bucket 내 복제할 counter의 인덱스 찾기.
    const idx = updatedCounterIds.findIndex((e) => e.toString() === counterId);
    // 복제할 counter의 인덱스가 존재하지 않는 경우 에러 처리.
    if (idx === -1)
        throw new HttpError_1.HttpError(500, {
            message: "Invalid data in counterIds property",
        });
    // counter를 복제하기 위한 유틸 함수를 호출.
    // 복제된 counter의 id를 반환.
    const duplicatedCounterId = yield (0, duplicate_1.duplicateCounterUtil)(counterData);
    // 복제된 counter를 원본 counter의 바로 옆 위치에 삽입.
    const slicedBeforeIdx = updatedCounterIds.slice(0, idx + 1);
    const slicedAfterIdx = updatedCounterIds.slice(idx + 1);
    slicedBeforeIdx.push(duplicatedCounterId);
    updatedCounterIds = [...slicedBeforeIdx, ...slicedAfterIdx];
    bucket.counterIds = updatedCounterIds;
    // DB에 저장.
    yield bucket.save();
    return res.status(201).json({ message: "Duplicate counter successfully" });
});
// counter를 다른 bucket 안으로 이동시키는 컨트롤러.
const moveCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // counter 이동의 주체가 되는 bucket의 id와 이동할 counter의 id가 요청 패러미터에 저장.
    const { bucketIdSubject, counterId } = req.params;
    // counter 이동의 대상이 되는 bucket의 id가 요청의 body에 저장.
    const { bucketIdObject } = req.body;
    // counter 이동의 주체가 되는 bucket을 DB로부터 쿼리.
    const bucketSubject = yield (0, find_1.findBucket)(bucketIdSubject);
    // counter 이동의 대상이 되는 bucket을 DB로부터 쿼리.
    const bucketObject = yield (0, find_1.findBucket)(bucketIdObject);
    // 이동할 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // 이동의 주체가 되는 bucket이 참조하는 counter 배열에서 이동할 counter에 대한 참조를 필터링.
    bucketSubject.counterIds = [...bucketSubject.counterIds].filter((e) => e.toString() !== counterId);
    // 이동의 대상이 되는 bucket이 참조하는 counter 배열에 이동할 counter에 대한 참조를 추가.
    bucketObject.counterIds.push(counter._id);
    // DB에 저장.
    yield bucketSubject.save();
    yield bucketObject.save();
    return res.status(201).json({ message: "Move counter successfully" });
});
// counter를 제거하는 컨트롤러.
const removeCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 삭제할 counter가 포함 된 bucket의 id와 삭제 될 counter의 id가 요청 패러미터에 저장.
    const { bucketId, counterId } = req.params;
    // 삭제할 counter가 포함 된 bucket을 DB로부터 쿼리.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    // 삭제 될 counter를 DB로부터 쿼리.
    const counter = yield (0, find_1.findCounter)(counterId);
    // counter를 DB에서 삭제하기 위해 호출하는 유틸 함수.
    yield (0, remove_1.removeCounterUtil)(counter);
    // bucket이 counter들을 참조하는 배열에서 삭제 된 counter에 대한 참조 필터링.
    bucket.counterIds = [...bucket.counterIds].filter((e) => e.toString() !== counterId);
    // DB에 저장.
    yield bucket.save();
    return res.status(201).json({ message: "Delete counter successfully" });
});
exports.default = {
    getCounterIds: (0, errorWrapper_1.errorWrapper)(getCounterIds),
    changeCounterPosition: (0, errorWrapper_1.errorWrapper)(changeCounterPosition),
    createCounter: (0, errorWrapper_1.errorWrapper)(createCounter),
    duplicateCounter: (0, errorWrapper_1.errorWrapper)(duplicateCounter),
    moveCounter: (0, errorWrapper_1.errorWrapper)(moveCounter),
    removeCounter: (0, errorWrapper_1.errorWrapper)(removeCounter),
};
