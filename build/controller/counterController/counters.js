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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const counter_2 = require("@/validation/counter");
const counter_3 = __importDefault(require("@/constants/counter"));
const utils_1 = require("../utils");
const getCounterIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield (0, utils_1.findBucket)(bucketId);
    return res.status(200).json({ counterIds: bucket.counterIds });
});
const createCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield (0, utils_1.findBucket)(bucketId);
    const { error } = (0, counter_2.counterValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title, startCount, endCount } = req.body;
    const direction = startCount < endCount
        ? counter_3.default.direction.up
        : counter_3.default.direction.down;
    const newCounter = new counter_1.default({
        title,
        startCount,
        currentCount: startCount,
        endCount,
        direction,
        achievementStack: 0,
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    yield newCounter.save();
    bucket.counterIds.push(newCounter._id);
    yield bucket.save();
    return res.status(201).json({ message: "Create counter successfully" });
});
const duplicateCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId, counterId } = req.params;
    const bucket = yield (0, utils_1.findBucket)(bucketId);
    const counter = yield (0, utils_1.findCounter)(counterId);
    const duplicatedCounter = new counter_1.default({
        title: counter.title,
        startCount: counter.startCount,
        currentCount: counter.startCount,
        endCount: counter.endCount,
        direction: counter.direction,
        achievementStack: 0,
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    let updatedCounterIds = [...bucket.counterIds];
    const idx = updatedCounterIds.findIndex((e) => e.toString() === counterId);
    if (idx === -1)
        throw new HttpError_1.HttpError(500, {
            message: "Invalid data in counterIds property",
        });
    const slicedBeforeIdx = updatedCounterIds.slice(0, idx + 1);
    const slicedAfterIdx = updatedCounterIds.slice(idx + 1);
    slicedBeforeIdx.push(duplicatedCounter._id);
    updatedCounterIds = [...slicedBeforeIdx, ...slicedAfterIdx];
    bucket.counterIds = updatedCounterIds;
    yield duplicatedCounter.save();
    yield bucket.save();
    return res.status(201).json({ message: "Duplicate counter successfully" });
});
const moveCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketIdSubject, counterId } = req.params;
    const { bucketIdObject } = req.body;
    const bucketSubject = yield (0, utils_1.findBucket)(bucketIdSubject);
    const bucketObject = yield (0, utils_1.findBucket)(bucketIdObject);
    const counter = yield (0, utils_1.findCounter)(counterId);
    bucketSubject.counterIds = [...bucketSubject.counterIds].filter((e) => e.toString() !== counterId);
    bucketObject.counterIds.push(counter._id);
    yield bucketSubject.save();
    yield bucketObject.save();
    return res.status(201).json({ message: "Move counter successfully" });
});
const removeCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId, counterId } = req.params;
    const bucket = yield (0, utils_1.findBucket)(bucketId);
    const counter = yield (0, utils_1.findCounter)(counterId);
    yield (0, utils_1.removeCounterUtil)(counter);
    bucket.counterIds = [...bucket.counterIds].filter((e) => e.toString() !== counterId);
    yield bucket.save();
    return res.status(201).json({ message: "Delete counter successfully" });
});
exports.default = {
    getCounterIds: (0, errorWrapper_1.errorWrapper)(getCounterIds),
    createCounter: (0, errorWrapper_1.errorWrapper)(createCounter),
    duplicateCounter: (0, errorWrapper_1.errorWrapper)(duplicateCounter),
    moveCounter: (0, errorWrapper_1.errorWrapper)(moveCounter),
    removeCounter: (0, errorWrapper_1.errorWrapper)(removeCounter),
};
