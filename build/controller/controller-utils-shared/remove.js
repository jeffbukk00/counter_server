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
exports.removeBucketUtil = exports.removeCounterUtil = void 0;
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const count_1 = __importDefault(require("@/model/history/count"));
const removeCounterUtil = (counter) => __awaiter(void 0, void 0, void 0, function* () {
    yield motivationText_1.default.deleteMany({ _id: { $in: counter.motivationTextIds } });
    yield motivationLink_1.default.deleteMany({ _id: { $in: counter.motivationLinkIds } });
    const achievementStackHistory = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    });
    for (const e of achievementStackHistory)
        yield count_1.default.deleteMany({ _id: { $in: e.countHistory } });
    yield achievementStack_1.default.deleteMany({
        _id: { $in: counter.achievementStackHistory },
    });
    yield counter_1.default.deleteOne({ _id: counter._id });
    return;
});
exports.removeCounterUtil = removeCounterUtil;
const removeBucketUtil = (bucket) => __awaiter(void 0, void 0, void 0, function* () {
    bucket.counterIds.forEach((e) => (0, exports.removeCounterUtil)(e));
    yield motivationText_1.default.deleteMany({ _id: { $in: bucket.motivationTextIds } });
    yield motivationLink_1.default.deleteMany({ _id: { $in: bucket.motivationLinkIds } });
    yield bucket_1.default.deleteOne({ _id: bucket._id });
    return;
});
exports.removeBucketUtil = removeBucketUtil;
