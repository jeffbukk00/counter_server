"use strict";
/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  bucket과 counter 복제 관련.
*/
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
exports.duplicateBucketUtil = exports.duplicateCounterUtil = exports.insertMotivationLinks = exports.insertMotivationTexts = void 0;
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const shared_1 = __importDefault(require("@/constants/shared"));
// bucket과 counter에 motivationText들을 복제할 때 호출 되는 유틸 함수.
const insertMotivationTexts = (motivationTexts) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationText들을 생성 및 DB에 저장해서 복제.
    const insertedMotivationTexts = yield motivationText_1.default.insertMany(motivationTexts.map((e) => {
        return { text: e.text };
    }));
    // 복제될 bucket 또는 counter이 복제된 motivationText들을 참조.
    const motivationTextIds = [...insertedMotivationTexts].map((e) => e._id);
    return motivationTextIds;
});
exports.insertMotivationTexts = insertMotivationTexts;
// bucket과 counter에 motivationLink들을 복제 할 때 호출 되는 유틸 함수.
const insertMotivationLinks = (motivationLinks) => __awaiter(void 0, void 0, void 0, function* () {
    // motivationLink들을 생성 및 DB에 저장해서 복제.
    const insertedMotivationLinks = yield motivationLink_1.default.insertMany(motivationLinks.map((e) => {
        return { title: e.title, link: e.link };
    }));
    // 복제될 bucket 또는 counter이 복제된 motivationLink들을 참조.
    const motivationLinkIds = [...insertedMotivationLinks].map((e) => e._id);
    return motivationLinkIds;
});
exports.insertMotivationLinks = insertMotivationLinks;
// counter를 복제할 때 호출 되는 유틸 함수.
const duplicateCounterUtil = (counter_2, ...args_1) => __awaiter(void 0, [counter_2, ...args_1], void 0, function* (counter, duplicateType = shared_1.default.duplicateType.all) {
    // 최초의 achievementStack 생성.
    const initialAchievementHistory = new achievementStack_1.default({
        isAchieved: false,
        stack: 0,
        comment: "",
        countHistory: [],
        createdAt: new Date(),
        achievedAt: null,
    });
    // counter 생성 및 최초의 achievementStack 참조.
    const newCounter = new counter_1.default({
        title: counter.title,
        startCount: counter.startCount,
        currentCount: counter.startCount,
        endCount: counter.endCount,
        direction: counter.direction,
        achievementStack: 0,
        achievementStackHistory: [initialAchievementHistory],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    // 생성 된 counter에 motivation들을 복제.
    newCounter.motivationTextIds = yield (0, exports.insertMotivationTexts)([
        ...counter.motivationTexts,
    ]);
    if (duplicateType === shared_1.default.duplicateType.all) {
        // 안전한 타입의 복제(공유)일 경우, motivationLink를 제외하고 복제.
        newCounter.motivationLinkIds = yield (0, exports.insertMotivationLinks)([
            ...counter.motivationLinks,
        ]);
    }
    // DB에 저장.
    yield initialAchievementHistory.save();
    yield newCounter.save();
    return newCounter._id;
});
exports.duplicateCounterUtil = duplicateCounterUtil;
// bucket을 복제할 때 호출 되는 유틸 함수.
const duplicateBucketUtil = (bucket_2, counters_1, ...args_2) => __awaiter(void 0, [bucket_2, counters_1, ...args_2], void 0, function* (bucket, counters, duplicateType = shared_1.default.duplicateType.all) {
    // 새로운 bucket 생성.
    const newBucket = new bucket_1.default({
        title: bucket.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    // 생성 된 counter에 motivation들을 복제.
    newBucket.motivationTextIds = yield (0, exports.insertMotivationTexts)([
        ...bucket.motivationTexts,
    ]);
    if (duplicateType === shared_1.default.duplicateType.all) {
        // 안전한 타입의 복제(공유)일 경우, motivationLink를 제외하고 복제.
        newBucket.motivationLinkIds = yield (0, exports.insertMotivationLinks)([
            ...bucket.motivationLinks,
        ]);
    }
    // 생성 된 bucket에 counter들에 대한 참조를 복제.
    for (const e of counters) {
        const duplicatedCounterId = yield (0, exports.duplicateCounterUtil)(e, duplicateType);
        newBucket.counterIds.push(duplicatedCounterId);
    }
    // DB에 저장.
    yield newBucket.save();
    return newBucket._id;
});
exports.duplicateBucketUtil = duplicateBucketUtil;
