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
exports.findCounter = exports.findBucket = exports.findUser = void 0;
const user_1 = __importDefault(require("../../model/user"));
const bucket_1 = __importDefault(require("../../model/bucket"));
const counter_1 = __importDefault(require("../../model/counter"));
const HttpError_1 = require("../../error/HttpError");
const findUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 유저의 user id에 해당 되는 유저를 데이터베이스로부터 가져옴.
    const user = yield user_1.default.findOne({ _id: userId });
    // 요청한 유저의 user id에 해당 되는 유저가 데이터베이스 내 존재하지 않는다면, 404 에러를 throw.
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    return user;
});
exports.findUser = findUser;
const findBucket = (bucketId) => __awaiter(void 0, void 0, void 0, function* () {
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    return bucket;
});
exports.findBucket = findBucket;
const findCounter = (counterId) => __awaiter(void 0, void 0, void 0, function* () {
    const counter = yield counter_1.default.findOne({ _id: counterId });
    if (!counter)
        throw new HttpError_1.HttpError(404, { message: "Counter not found" });
    return counter;
});
exports.findCounter = findCounter;
