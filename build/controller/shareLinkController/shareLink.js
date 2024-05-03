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
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const shareLink_1 = __importDefault(require("@/model/shareLink"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const uploadShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { bucketId } = req.body;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId }).populate("motivationTextIds motivationLinkIds", "-_id");
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const counterIds = bucket.counterIds;
    const counters = yield counter_1.default.find({ _id: { $in: counterIds } }).populate("motivationTextIds motivationLinkIds", "-_id");
    const sharedBucket = {
        title: bucket.title,
        motivationTexts: bucket.motivationTextIds,
        motivationLinks: bucket.motivationLinkIds,
    };
    const sharedCounters = [...counters].map((e) => {
        return {
            title: e.title,
            startCount: e.startCount,
            endCount: e.endCount,
            direction: e.direction,
            motivationTexts: e.motivationTextIds,
            motivationLinks: e.motivationLinkIds,
        };
    });
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    const newShareLink = new shareLink_1.default({
        bucket: sharedBucket,
        counters: sharedCounters,
        userId,
        expirationDate,
    });
    yield newShareLink.save();
    return res.status(201).json({ shareLink: `/sharing/${newShareLink._id}` });
});
const validateShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { shareLinkId } = req.params;
    const shareLink = yield shareLink_1.default.findOne({ _id: shareLinkId });
    if (!shareLink)
        throw new HttpError_1.HttpError(500, { isValid: false });
    const user = yield user_1.default.findOne({ _id: shareLink.userId });
    let username;
    if (user) {
        username = user.username;
    }
    else {
        username = "(탈퇴한 유저입니다)";
    }
    return res.status(200).json({ isValid: true, username });
});
const downloadShareLinkAll = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { shareLinkId } = req.params;
    const shareLink = yield shareLink_1.default.findOne({ _id: shareLinkId });
    if (!shareLink)
        throw new HttpError_1.HttpError(500, { message: "This share link was expired" });
    // 버킷 생성. 버킷에 대한 모티베이션 텍스트들, 모티베이션 링크들 생성.
    const newBucket = new bucket_1.default({
        title: (_a = shareLink.bucket) === null || _a === void 0 ? void 0 : _a.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    const motivationTextsInBucket = yield motivationText_1.default.insertMany([...shareLink.bucket.motivationTexts].map((e) => {
        return { text: e.text };
    }));
    const motivationTextIdsInBucket = [...motivationTextsInBucket].map((e) => e._id);
    newBucket.motivationTextIds = motivationTextIdsInBucket;
    const motivationLinksInBucket = yield motivationLink_1.default.insertMany([...shareLink.bucket.motivationLinks].map((e) => {
        return { title: e.title, link: e.link };
    }));
    const motivationLinkIdsInBucket = [...motivationLinksInBucket].map((e) => e._id);
    newBucket.motivationLinkIds = motivationLinkIdsInBucket;
    // 카운터들 생성. 각각의 카운터에 대한 모티베이션 텍스트들, 모티베이션 링크들 생성.
    const counterIdsInBucket = [];
    for (let e of [...shareLink.counters]) {
        const newCounter = new counter_1.default({
            title: e.title,
            startCount: e.startCount,
            currentCount: 0,
            endCount: e.endCount,
            direction: e.direction,
            achievementStack: 0,
            motivationTextIds: [],
            motivationLinkIds: [],
        });
        const motivationTextsInCounter = yield motivationText_1.default.insertMany([...e.motivationTexts].map((e) => {
            return { text: e.text };
        }));
        const motivationTextIdsInCounter = [...motivationTextsInCounter].map((e) => e._id);
        newCounter.motivationTextIds = motivationTextIdsInCounter;
        const motivationLinksInCounter = yield motivationLink_1.default.insertMany([...e.motivationLinks].map((e) => {
            return { title: e.title, link: e.link };
        }));
        const motivationLinkIdsInCounter = [...motivationLinksInCounter].map((e) => e._id);
        newCounter.motivationLinkIds = motivationLinkIdsInCounter;
        yield newCounter.save();
        counterIdsInBucket.push(newCounter._id);
    }
    newBucket.counterIds = counterIdsInBucket;
    yield newBucket.save();
    user.bucketIds.push(newBucket._id);
    yield user.save();
    return res
        .status(201)
        .json({ message: "Download from share link successfully" });
});
const downloadShareLinkSecure = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { shareLinkId } = req.params;
    const shareLink = yield shareLink_1.default.findOne({ _id: shareLinkId });
    if (!shareLink)
        throw new HttpError_1.HttpError(500, { message: "This share link was expired" });
    // 버킷 생성. 버킷에 대한 모티베이션 텍스트들 생성. 모티베이션 링크들 제외.
    const newBucket = new bucket_1.default({
        title: (_b = shareLink.bucket) === null || _b === void 0 ? void 0 : _b.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    const motivationTextsInBucket = yield motivationText_1.default.insertMany([...shareLink.bucket.motivationTexts].map((e) => {
        return { text: e.text };
    }));
    const motivationTextIdsInBucket = [...motivationTextsInBucket].map((e) => e._id);
    newBucket.motivationTextIds = motivationTextIdsInBucket;
    // 카운터들 생성. 각각의 카운터에 대한 모티베이션 텍스트들 생성, 모티베이션 링크들은 제외.
    const counterIdsInBucket = [];
    for (let e of [...shareLink.counters]) {
        const newCounter = new counter_1.default({
            title: e.title,
            startCount: e.startCount,
            currentCount: 0,
            endCount: e.endCount,
            direction: e.direction,
            achievementStack: 0,
            motivationTextIds: [],
            motivationLinkIds: [],
        });
        const motivationTextsInCounter = yield motivationText_1.default.insertMany([...e.motivationTexts].map((e) => {
            return { text: e.text };
        }));
        const motivationTextIdsInCounter = [...motivationTextsInCounter].map((e) => e._id);
        newCounter.motivationTextIds = motivationTextIdsInCounter;
        yield newCounter.save();
        counterIdsInBucket.push(newCounter._id);
    }
    newBucket.counterIds = counterIdsInBucket;
    yield newBucket.save();
    user.bucketIds.push(newBucket._id);
    yield user.save();
    return res
        .status(201)
        .json({ message: "Download from share link successfully" });
});
exports.default = {
    uploadShareLink: (0, errorWrapper_1.errorWrapper)(uploadShareLink),
    validateShareLink: (0, errorWrapper_1.errorWrapper)(validateShareLink),
    downloadShareLinkAll: (0, errorWrapper_1.errorWrapper)(downloadShareLinkAll),
    downloadShareLinkSecure: (0, errorWrapper_1.errorWrapper)(downloadShareLinkSecure),
};
