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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const bucket_2 = require("@/validation/bucket");
const getBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    res.status(200).json({ bucket });
});
const editBucket = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { bucketId } = req.params;
    const bucket = yield bucket_1.default.findOne({ _id: bucketId });
    if (!bucket)
        throw new HttpError_1.HttpError(404, { message: "Bucket not found" });
    const { error } = (0, bucket_2.bucketValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title } = req.body;
    bucket.title = title;
    yield bucket.save();
    return res.status(201).json({ message: "Edit bucket successfully" });
});
exports.default = {
    getBucket: (0, errorWrapper_1.errorWrapper)(getBucket),
    editBucket: (0, errorWrapper_1.errorWrapper)(editBucket),
};
