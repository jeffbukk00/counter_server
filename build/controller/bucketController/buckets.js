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
const user_1 = __importDefault(require("@/model/user"));
const bucket_1 = __importDefault(require("@/model/bucket"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const bucket_2 = require("@/validation/bucket");
const getBuckets = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId }).populate("bucketIds");
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    res.status(200).json({ buckets: user.bucketIds });
});
const getBucketIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    res.status(200).json({ bucketIds: user.bucketIds });
});
const createBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { error } = (0, bucket_2.bucketValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title } = req.body;
    const newBucket = new bucket_1.default({
        title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    yield newBucket.save();
    user.bucketIds.push(newBucket._id);
    yield user.save();
    res.status(201).json({ message: "Create bucket successfully" });
});
const duplicateBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const duplicatedBucket = new bucket_1.default({
        title: bucket.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    yield duplicatedBucket.save();
    let updatedBucketIds = [...user.bucketIds];
    const idx = updatedBucketIds.findIndex((e) => e.toString() === bucketId);
    if (idx === -1)
        throw new HttpError_1.HttpError(500, { message: "Invalid data in bucketIds property" });
    const slicedBeforeIdx = updatedBucketIds.slice(0, idx + 1);
    const slicedAfterIdx = updatedBucketIds.slice(idx + 1);
    slicedBeforeIdx.push(duplicatedBucket._id);
    updatedBucketIds = [...slicedBeforeIdx, ...slicedAfterIdx];
    user.bucketIds = updatedBucketIds;
    yield user.save();
    return res.status(201).json({ message: "Duplicate bucket successfully" });
});
const mergeBuckets = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { bucketIdSubject } = req.params;
    const { bucketIdObject } = req.body;
    const bucketSubject = yield bucket_1.default.findOne({ _id: bucketIdSubject });
    if (!bucketSubject)
        throw new HttpError_1.HttpError(404, { message: "Subject bucket not found" });
    const bucketObject = yield bucket_1.default.findOne({ _id: bucketIdObject });
    if (!bucketObject)
        throw new HttpError_1.HttpError(404, { message: "Object bucket not found" });
    bucketSubject.counterIds = [...bucketSubject.counterIds].concat([
        ...bucketObject.counterIds,
    ]);
    bucketSubject.motivationTextIds = [...bucketSubject.motivationTextIds].concat([...bucketObject.motivationTextIds]);
    bucketSubject.motivationLinkIds = [...bucketSubject.motivationLinkIds].concat([...bucketObject.motivationLinkIds]);
    yield bucketSubject.save();
    yield bucket_1.default.deleteOne({ _id: bucketIdObject });
    user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketIdObject);
    yield user.save();
    return res.status(201).json({ message: "Merge buckets successfully" });
});
const removeBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { bucketId } = req.params;
    yield bucket_1.default.deleteOne({ _id: bucketId });
    user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketId);
    yield user.save();
    return res.status(201).json({ message: "Remove bucket successfully" });
});
exports.default = {
    getBuckets: (0, errorWrapper_1.errorWrapper)(getBuckets),
    getBucketIds: (0, errorWrapper_1.errorWrapper)(getBucketIds),
    createBucket: (0, errorWrapper_1.errorWrapper)(createBucket),
    duplicateBucket: (0, errorWrapper_1.errorWrapper)(duplicateBucket),
    mergeBuckets: (0, errorWrapper_1.errorWrapper)(mergeBuckets),
    removeBucket: (0, errorWrapper_1.errorWrapper)(removeBucket),
};
