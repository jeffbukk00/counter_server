"use strict";
/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  counter와 bucket 제거 관련.
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
exports.removeBucketUtil = exports.removeCounterUtil = void 0;
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const achievementStack_1 = __importDefault(require("@/model/history/achievementStack"));
const count_1 = __importDefault(require("@/model/history/count"));
// counter를 제거할 때 호출 되는 유틸 함수.
const removeCounterUtil = (counter) => __awaiter(void 0, void 0, void 0, function* () {
    // counter가 참조하고 있는 motivation들을 DB에서 제거.
    yield motivationText_1.default.deleteMany({ _id: { $in: counter.motivationTextIds } });
    yield motivationLink_1.default.deleteMany({ _id: { $in: counter.motivationLinkIds } });
    // counter가 참조하는 achievementStack들 DB에서 쿼리.
    const achievementStackHistory = yield achievementStack_1.default.find({
        _id: { $in: counter.achievementStackHistory },
    });
    for (const e of achievementStackHistory) {
        // achievementStack이 참조하는 count들 DB에서 제거.
        yield count_1.default.deleteMany({ _id: { $in: e.countHistory } });
    }
    // counter가 참조하는 achievementStack들 DB에서 제거.
    yield achievementStack_1.default.deleteMany({
        _id: { $in: counter.achievementStackHistory },
    });
    // counter DB에서 제거.
    yield counter_1.default.deleteOne({ _id: counter._id });
    return;
});
exports.removeCounterUtil = removeCounterUtil;
// bucket을 제거할 때 호출 되는 유틸 함수.
const removeBucketUtil = (bucket) => __awaiter(void 0, void 0, void 0, function* () {
    // bucket이 참조하고 있는 counter들 DB에서 제거.
    bucket.counterIds.forEach((e) => (0, exports.removeCounterUtil)(e));
    // bucket이 참조하고 있는 motivation들을 DB에서 제거.
    yield motivationText_1.default.deleteMany({ _id: { $in: bucket.motivationTextIds } });
    yield motivationLink_1.default.deleteMany({ _id: { $in: bucket.motivationLinkIds } });
    // bucket DB에서 제거.
    yield bucket_1.default.deleteOne({ _id: bucket._id });
    return;
});
exports.removeBucketUtil = removeBucketUtil;
