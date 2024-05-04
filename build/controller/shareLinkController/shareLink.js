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
const shareLink_1 = __importDefault(require("@/model/shareLink"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const shareLink_2 = __importDefault(require("@/constants/shareLink"));
const shareLink_3 = require("./utils/shareLink");
// 공유 링크를 데이터베이스에 업로드(생성)하기 위한 컨트롤러.
const uploadShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { bucketId } = req.body;
    // 요청의 body로 전달 된 bucket id에 해당하는 버킷을 데이터베이스로부터 가져옴.
    // 공유할 버킷.
    // 해당 버킷 내에 존재하는 모티베이션 텍스트들과 모티베이션 링크들도 데이터베이스로부터 가져옴.
    const bucket = yield bucket_1.default.findOne({ _id: bucketId }).populate("motivationTextIds motivationLinkIds", "-_id");
    // 요청의 body로 전달 된 bucket id에 해당하는 버킷이 데이터베이스 내 존재하지 않을 경우, 404 에러를 throw.
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    // 공유할 버킷 내에 존재하는 카운터들을 데이터베이스로부터 가져옴.
    // 각각의 카운터 내에 존재하는 모티베이션 텍스트들과 모티베이션 링크들을 데이터베이스로부터 가져옴.
    const counterIds = bucket.counterIds;
    const counters = yield counter_1.default.find({ _id: { $in: counterIds } }).populate("motivationTextIds motivationLinkIds", "-_id");
    // 위에서 가져온 데이터들을 바탕으로, 공유 링크 생성 및 저장.
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
    // 생성된 공유 링크의 id가 포함 된 경로를 응답 데이터로 함.
    return res.status(201).json({ shareLink: `/sharing/${newShareLink._id}` });
});
// 공유 링크로부터 버킷을 다운로드 하기 전, 이것의 유효성 및 안전성을 확인하는 역할을 하는 컨트롤러.
const validateShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { shareLinkId } = req.params;
    // 요청 파라미터의 share link id에 해당하는 공유 링크를 데이터베이스로부터 가져옴.
    const shareLink = yield (0, shareLink_3.findShareLink)(shareLinkId, { isValid: false });
    // 공유 링크를 업로드(생성)한 유저를 데이터베이스로부터 가져옴.
    const user = yield user_1.default.findOne({ _id: shareLink.userId });
    let username;
    if (user) {
        username = user.username;
    }
    else {
        username = "(탈퇴한 유저입니다)";
    }
    // 공유 링크의 유효성 및 안전성 여부와 이를 생성한 유저의 이름을 응답 데이터로 함.
    return res.status(200).json({ isValid: true, username });
});
// 공유 링크로부터 버킷을 다운로드 하기 위한 컨트롤러.
const downloadShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req;
    // 요청한 유저의 user id에 해당되는 유저를 데이터베이스로부터 가져옴.
    const user = yield user_1.default.findOne({ _id: userId });
    // 요청한 유저의 user id에 해당되는 유저가 존재하지 않을 경우, 404 에러를 throw.
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    const { shareLinkId } = req.params;
    // 요청 파라미터의 share link id에 해당하는 공유 링크를 데이터베이스로부터 가져옴.
    const shareLink = yield (0, shareLink_3.findShareLink)(shareLinkId, {
        message: "This share link was expired",
    });
    // 다운로드 할 버킷 생성.
    const newBucket = new bucket_1.default({
        title: (_a = shareLink.bucket) === null || _a === void 0 ? void 0 : _a.title,
        counterIds: [],
        motivationTextIds: [],
        motivationLinkIds: [],
    });
    const { downloadType } = req.params;
    // 다운로드 할 버킷 내 존재하는 모티베이션 텍스트들 생성 및 저장.
    // 이들의 id 배열을 해당 버킷에 할당.
    newBucket.motivationTextIds = yield (0, shareLink_3.downloadMotivationTexts)([
        ...shareLink.bucket.motivationTexts,
    ]);
    if (downloadType === shareLink_2.default.downloadType.all) {
        // downloadType이 "all"인 경우에만 해당.
        // 다운로드 할 버킷 내 존재하는 모티베이션 링크들 생성 및 저장.
        // 이들의 id 배열을 해당 버킷에 할당
        newBucket.motivationLinkIds = yield (0, shareLink_3.downloadMotivationLinks)([
            ...shareLink.bucket.motivationLinks,
        ]);
    }
    // 다운로드 할 버킷 내 존재하는 카운터들의 id를 담을 배열.
    const counterIdsInBucket = [];
    for (let e of [...shareLink.counters]) {
        // 다운로드 할 버킷 내 존재하는 카운터 생성.
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
        // 해당 카운터 내 존재하는 모티베이션 텍스트들 생성 및 저장.
        // 이들의 id 배열을 해당 카운터에 할당.
        newCounter.motivationTextIds = yield (0, shareLink_3.downloadMotivationTexts)([
            ...e.motivationTexts,
        ]);
        if (downloadType === shareLink_2.default.downloadType.all) {
            // downloadType이 "all"인 경우에만 해당.
            // 해당 카운터 내 존재하는 모티베이션 링크들 생성 및 저장.
            // 이들의 id 배열을 해당 카운터에 할당.
            newCounter.motivationLinkIds = yield (0, shareLink_3.downloadMotivationLinks)([
                ...e.motivationLinks,
            ]);
        }
        // 카운터 저장.
        yield newCounter.save();
        // 생성된 카운터의 id를 counterIdsInBucket 배열에 push.
        counterIdsInBucket.push(newCounter._id);
    }
    // 다운로드 할 버킷에 카운터들의 id 배열을 할당 후, 저장.
    newBucket.counterIds = counterIdsInBucket;
    yield newBucket.save();
    // 다운로드를 요청한 유저에 공유 받을 버킷의 id를 추가 한 후, 저장.
    user.bucketIds.push(newBucket._id);
    yield user.save();
    return res
        .status(201)
        .json({ message: "Download from share link successfully" });
});
exports.default = {
    uploadShareLink: (0, errorWrapper_1.errorWrapper)(uploadShareLink),
    validateShareLink: (0, errorWrapper_1.errorWrapper)(validateShareLink),
    downloadShareLink: (0, errorWrapper_1.errorWrapper)(downloadShareLink),
};
