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
exports.duplicateBucketUtil = exports.duplicateCounterUtil = exports.insertMotivationLinks = exports.insertMotivationTexts = void 0;
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const shared_1 = __importDefault(require("@/constants/shared"));
const achievementStack_1 = __importDefault(require("@/model/logging/achievementStack"));
const insertMotivationTexts = (motivationTexts) => __awaiter(void 0, void 0, void 0, function* () {
    const insertedMotivationTexts = yield motivationText_1.default.insertMany(motivationTexts.map((e) => {
        return { text: e.text };
    }));
    const motivationTextIds = [...insertedMotivationTexts].map((e) => e._id);
    return motivationTextIds;
});
exports.insertMotivationTexts = insertMotivationTexts;
const insertMotivationLinks = (motivationLinks) => __awaiter(void 0, void 0, void 0, function* () {
    const insertedMotivationLinks = yield motivationLink_1.default.insertMany(motivationLinks.map((e) => {
        return { title: e.title, link: e.link };
    }));
    const motivationLinkIds = [...insertedMotivationLinks].map((e) => e._id);
    return motivationLinkIds;
});
exports.insertMotivationLinks = insertMotivationLinks;
const duplicateCounterUtil = (counter_2, ...args_1) => __awaiter(void 0, [counter_2, ...args_1], void 0, function* (counter, duplicateType = shared_1.default.duplicateType.all) {
    const initialAchievementHistory = new achievementStack_1.default({
        stack: 0,
        comment: "",
        timeStamp: new Date(),
        countHistory: [],
    });
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
    yield initialAchievementHistory.save();
    newCounter.motivationTextIds = yield (0, exports.insertMotivationTexts)([
        ...counter.motivationTexts,
    ]);
    if (duplicateType === shared_1.default.duplicateType.all) {
        newCounter.motivationLinkIds = yield (0, exports.insertMotivationLinks)([
            ...counter.motivationLinks,
        ]);
    }
    yield newCounter.save();
    return newCounter._id;
});
exports.duplicateCounterUtil = duplicateCounterUtil;
const duplicateBucketUtil = (bucket_2, counters_1, ...args_2) => __awaiter(void 0, [bucket_2, counters_1, ...args_2], void 0, function* (bucket, counters, duplicateType = shared_1.default.duplicateType.all) {
    const newBucket = new bucket_1.default({
        title: bucket.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    newBucket.motivationTextIds = yield (0, exports.insertMotivationTexts)([
        ...bucket.motivationTexts,
    ]);
    if (duplicateType === shared_1.default.duplicateType.all) {
        newBucket.motivationLinkIds = yield (0, exports.insertMotivationLinks)([
            ...bucket.motivationLinks,
        ]);
    }
    for (const e of counters) {
        const duplicatedCounterId = yield (0, exports.duplicateCounterUtil)(e, duplicateType);
        newBucket.counterIds.push(duplicatedCounterId);
    }
    yield newBucket.save();
    return newBucket._id;
});
exports.duplicateBucketUtil = duplicateBucketUtil;
