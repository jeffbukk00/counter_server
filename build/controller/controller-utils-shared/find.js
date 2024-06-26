"use strict";
/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  DB로부터의 쿼리 관련.
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
exports.findCounter = exports.findBucket = exports.findUser = void 0;
const user_1 = __importDefault(require("@/model/user"));
const bucket_1 = __importDefault(require("@/model/bucket"));
const counter_1 = __importDefault(require("@/model/counter"));
const HttpError_1 = require("@/error/HttpError");
// user 쿼리.
const findUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // DB로부터 user 쿼리.
    const user = yield user_1.default.findOne({ _id: userId });
    // 존재하지 않는 user에 대한 에러 처리.
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    return user;
});
exports.findUser = findUser;
// bucket 쿼리.
const findBucket = (bucketId) => __awaiter(void 0, void 0, void 0, function* () {
    // DB로부터 bucket 쿼리.
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    // 존재하지 않는 bucket에 대한 에러 처리.
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    return bucket;
});
exports.findBucket = findBucket;
// counter 쿼리.
const findCounter = (counterId) => __awaiter(void 0, void 0, void 0, function* () {
    // DB로부터 counter 쿼리.
    const counter = yield counter_1.default.findOne({ _id: counterId });
    // 존재하지 않는 counter에 대한 에러 처리.
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
    return counter;
});
exports.findCounter = findCounter;
