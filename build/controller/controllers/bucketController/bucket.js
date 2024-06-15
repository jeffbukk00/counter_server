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
Object.defineProperty(exports, "__esModule", { value: true });
const find_1 = require("@/controller/controller-utils-shared/find");
const bucket_1 = require("@/validation/bucket");
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// bucket 하나의 데이터를 가져오는 컨트롤러.
const getBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 데이터를 요청하는 bucket의 id를 요청 패러미터에 저장.
    const { bucketId } = req.params;
    // 요청된 bucket을 DB에서 가져옴.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    res.status(200).json({ bucket });
});
// bucket을 수정하는 컨트롤러.
const editBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 수정을 요청하는 bucket의 id를 요청 패러미터에 저장.
    const { bucketId } = req.params;
    // 수정할 bucket을 DB에서 가져옴.
    const bucket = yield (0, find_1.findBucket)(bucketId);
    // 요청의 body에 저장 된 bucket 수정 데이터에 대한 유효성 검사.
    const { error } = (0, bucket_1.bucketValidation)(req.body);
    // bucket 수정 데이터에 대한 유효성 검사를 통과하지 못한 경우에 대한 에러 처리.
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    // bucket 수정.
    const { title } = req.body;
    bucket.title = title;
    // DB에 저장.
    yield bucket.save();
    return res.status(201).json({ message: "Edit bucket successfully" });
});
exports.default = {
    getBucket: (0, errorWrapper_1.errorWrapper)(getBucket),
    editBucket: (0, errorWrapper_1.errorWrapper)(editBucket),
};
