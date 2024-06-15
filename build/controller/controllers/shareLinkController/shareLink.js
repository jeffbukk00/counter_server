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
const shareLink_2 = require("@/controller/controllers/shareLinkController/controller-utils-not-shared/shareLink");
const duplicate_1 = require("@/controller/controller-utils-shared/duplicate");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// shareLink를 업로드(생성) 하기 위한 컨트롤러.
const uploadShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // shareLink를 업로드하는 유저의 id가 request 객체에 저장.
    const { userId } = req;
    // 공유할 bucket의 id가 요청의 body에 저장.
    const { bucketId } = req.body;
    // 공유할 bucket을 DB부터 쿼리.
    // 공유할 bucket이 참조하는 모든 motivation들 populate(join).
    // 공유할 bucket이 참조하는 모든 counter들 populate(join).
    const bucket = yield bucket_1.default.findOne({ _id: bucketId }).populate("counterIds motivationTextIds motivationLinkIds");
    // 존재하지 않는 bucket에 대한 에러 처리.
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    // 공유할 데이터 정리.
    // 모든 counter들 각각이 참조하는 모든 motivation들을 populate(join).
    const counters = yield counter_1.default.populate(bucket.counterIds, "motivationTextIds motivationLinkIds");
    // 공유할 데이터 정리.
    // bucket의 데이터.
    const sharedBucket = {
        title: bucket.title,
        motivationTexts: bucket.motivationTextIds,
        motivationLinks: bucket.motivationLinkIds,
    };
    // 공유할 데이터 정리.
    // bucket이 참조하는 counter들.
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
    // 공유 가능 기간(2주) 설정.
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    // 정리된 공유 데이터를 바탕으로 shareLink 생성.
    const newShareLink = new shareLink_1.default({
        bucket: sharedBucket,
        counters: sharedCounters,
        userId,
        expirationDate,
    });
    // DB에 저장.
    yield newShareLink.save();
    // 생성된 shareLink의 id가 포함 된 경로를 응답 데이터로 함.
    return res.status(201).json({ shareLink: `/sharing/${newShareLink._id}` });
});
// 요청 된 shareLink로부터 bucket을 다운로드(복제) 하기 전, 이것의 유효성 및 안전성을 확인하는 역할을 하는 컨트롤러.
const validateShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 다운로드 요청 된 shareLink의 id가 요청 패러미터에 저장.
    const { shareLinkId } = req.params;
    // shareLink를 DB로부터 쿼리.
    // 일치하는 shareLink가 존재한다면, 유효한 shareLink라고 판단.
    const shareLink = yield (0, shareLink_2.findShareLink)(shareLinkId, { isValid: false });
    // shareLink를 업로드(생성)한 유저를 DB로부터 쿼리.
    const user = yield user_1.default.findOne({ _id: shareLink.userId });
    let username;
    if (user) {
        username = user.username;
    }
    else {
        // 유저가 존재하지 않는 경우.
        username = "(탈퇴한 유저입니다)";
    }
    // shareLink의 유효성 및 안전성 여부와 이를 업로드한 유저의 이름을 응답 데이터로 함.
    return res.status(200).json({ isValid: true, username });
});
// shareLink로부터 bucket을 다운로드 하기 위한 컨트롤러.
const downloadShareLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 유저의 id가 request 객체에 저장.
    const { userId } = req;
    // 요청한 유저를 DB로부터 쿼리.
    const user = yield user_1.default.findOne({ _id: userId });
    // 존재하지 않는 유저에 대한 에러 처리.
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    // 다운로드 할 shareLink의 id와 다운로드 타입(all 또는 secure)이 요청 패러미터에 저장.
    const { shareLinkId, downloadType } = req.params;
    // 다운로드 할 shareLink를 DB로부터 가져옴.
    const shareLink = yield (0, shareLink_2.findShareLink)(shareLinkId, {
        message: "This share link was expired",
    });
    // shareLink에 저장 된 bucket 데이터를 다운로드(복제).
    const duplicatedBucketId = yield (0, duplicate_1.duplicateBucketUtil)(shareLink.bucket, shareLink.counters, downloadType);
    // 유저가 참조하는 bucket들을 담은 배열에 다운로드 된 bucket을 추가.
    user.bucketIds.push(duplicatedBucketId);
    // DB에 저장.
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
