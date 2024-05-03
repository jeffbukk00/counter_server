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
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const counter_2 = require("@/validation/counter");
const counter_3 = __importDefault(require("@/constants/counter"));
const getCounterIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    return res.status(200).json({ counterIds: bucket.counterIds });
});
const createCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
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
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const counter = yield counter_1.default.findOne({ _id: counterId });
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
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
    yield duplicatedCounter.save();
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
    yield bucket.save();
    return res.status(201).json({ message: "Duplicate counter successfully" });
});
const moveCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketIdSubject, counterId } = req.params;
    const { bucketIdObject } = req.body;
    const bucketSubject = yield bucket_1.default.findOne({ _id: bucketIdSubject });
    if (!bucketSubject)
        throw new HttpError_1.HttpError(404, { message: "Subject bucket not found" });
    const bucketObject = yield bucket_1.default.findOne({ _id: bucketIdObject });
    if (!bucketObject)
        throw new HttpError_1.HttpError(404, { message: "Object bucket not found" });
    const counter = yield counter_1.default.findOne({ _id: counterId });
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
    bucketSubject.counterIds = [...bucketSubject.counterIds].filter((e) => e.toString() !== counterId);
    bucketObject.counterIds.push(counter._id);
    yield bucketSubject.save();
    yield bucketObject.save();
    return res.status(201).json({ message: "Move counter successfully" });
});
const removeCounter = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId, counterId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const counter = yield counter_1.default.findOne({ _id: counterId });
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
    yield counter_1.default.deleteOne({ _id: counterId });
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
