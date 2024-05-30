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
const counter_1 = __importDefault(require("@/model/counter"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const bucket_2 = require("@/validation/bucket");
const find_1 = require("@/controller/controller-utils-shared/find");
const remove_1 = require("@/controller/controller-utils-shared/remove");
const duplicate_1 = require("@/controller/controller-utils-shared/duplicate");
const getBuckets = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId }).populate("bucketIds");
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    res.status(200).json({ buckets: user.bucketIds });
});
const getBucketIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield (0, find_1.findUser)(userId);
    res.status(200).json({ bucketIds: user.bucketIds });
});
const changeBucketPosition = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { bucketIds } = req.body;
    const user = yield (0, find_1.findUser)(userId);
    user.bucketIds = bucketIds;
    yield user.save();
    return res
        .status(201)
        .json({ message: "Change bucket's position successfully" });
});
const createBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield (0, find_1.findUser)(userId);
    const { data } = req.body;
    const { error } = (0, bucket_2.bucketValidation)(data);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title } = data;
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
    const user = yield (0, find_1.findUser)(userId);
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId }).populate("counterIds motivationTextIds motivationLinkIds");
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const bucketData = {
        title: bucket === null || bucket === void 0 ? void 0 : bucket.title,
        motivationTexts: bucket._doc.motivationTextIds,
        motivationLinks: bucket._doc.motivationLinkIds,
    };
    const counters = yield counter_1.default.populate(bucket.counterIds, "motivationTextIds motivationLinkIds");
    const countersData = counters.map((e) => {
        return {
            title: e.title,
            startCount: e.startCount,
            endCount: e.endCount,
            direction: e.direction,
            motivationTexts: e._doc.motivationTextIds,
            motivationLinks: e._doc.motivationLinkIds,
        };
    });
    let updatedBucketIds = [...user.bucketIds];
    const idx = updatedBucketIds.findIndex((e) => e.toString() === bucketId);
    if (idx === -1)
        throw new HttpError_1.HttpError(500, { message: "Invalid data in bucketIds property" });
    const duplicatedBucketId = yield (0, duplicate_1.duplicateBucketUtil)(bucketData, countersData);
    const slicedBeforeIdx = updatedBucketIds.slice(0, idx + 1);
    const slicedAfterIdx = updatedBucketIds.slice(idx + 1);
    slicedBeforeIdx.push(duplicatedBucketId);
    updatedBucketIds = [...slicedBeforeIdx, ...slicedAfterIdx];
    user.bucketIds = updatedBucketIds;
    yield user.save();
    return res.status(201).json({ message: "Duplicate bucket successfully" });
});
const mergeBuckets = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield (0, find_1.findUser)(userId);
    const { bucketIdSubject } = req.params;
    const { bucketIdObject } = req.body;
    const bucketSubject = yield (0, find_1.findBucket)(bucketIdSubject);
    const bucketObject = yield (0, find_1.findBucket)(bucketIdObject);
    bucketSubject.counterIds = [...bucketSubject.counterIds].concat([
        ...bucketObject.counterIds,
    ]);
    bucketSubject.motivationTextIds = [...bucketSubject.motivationTextIds].concat([...bucketObject.motivationTextIds]);
    bucketSubject.motivationLinkIds = [...bucketSubject.motivationLinkIds].concat([...bucketObject.motivationLinkIds]);
    yield bucketSubject.save();
    user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketIdObject);
    yield user.save();
    yield bucket_1.default.deleteOne({ _id: bucketIdObject });
    return res.status(201).json({ message: "Merge buckets successfully" });
});
const removeBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { bucketId } = req.params;
    const user = yield (0, find_1.findUser)(userId);
    const bucket = yield bucket_1.default.findOne({ _id: bucketId }).populate("counterIds");
    yield (0, remove_1.removeBucketUtil)(Object.assign({}, bucket._doc));
    user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketId);
    yield user.save();
    return res.status(201).json({ message: "Remove bucket successfully" });
});
exports.default = {
    getBuckets: (0, errorWrapper_1.errorWrapper)(getBuckets),
    getBucketIds: (0, errorWrapper_1.errorWrapper)(getBucketIds),
    changeBucketPosition: (0, errorWrapper_1.errorWrapper)(changeBucketPosition),
    createBucket: (0, errorWrapper_1.errorWrapper)(createBucket),
    duplicateBucket: (0, errorWrapper_1.errorWrapper)(duplicateBucket),
    mergeBuckets: (0, errorWrapper_1.errorWrapper)(mergeBuckets),
    removeBucket: (0, errorWrapper_1.errorWrapper)(removeBucket),
};
