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
const motivationLink_1 = __importDefault(require("@/model/motivation/motivationLink"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = require("@/validation/motivation");
const motivation_2 = __importDefault(require("@/constants/motivation"));
const getMotivationLinkIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    if (!boxType || typeof boxType !== "string")
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedBoxType = parseInt(boxType);
    if (parsedBoxType !== motivation_2.default.boxType.bucket &&
        parsedBoxType !== motivation_2.default.boxType.counter)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const { boxId } = req.params;
    const box = parsedBoxType === motivation_2.default.boxType.bucket
        ? yield bucket_1.default.findOne({ _id: boxId })
        : yield counter_1.default.findOne({ _id: boxId });
    if (!box)
        throw new HttpError_1.HttpError(404, { message: "Box not found" });
    return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
});
const createMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    if (!boxType || typeof boxType !== "string")
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedBoxType = parseInt(boxType);
    if (parsedBoxType !== motivation_2.default.boxType.bucket &&
        parsedBoxType !== motivation_2.default.boxType.counter)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const { boxId } = req.params;
    const box = parsedBoxType === motivation_2.default.boxType.bucket
        ? yield bucket_1.default.findOne({ _id: boxId })
        : yield counter_1.default.findOne({ _id: boxId });
    if (!box)
        throw new HttpError_1.HttpError(404, { message: "Box not found" });
    const { error } = (0, motivation_1.motivationLinkValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { title, link } = req.body;
    const newMotivationLink = new motivationLink_1.default({
        title,
        link,
    });
    yield newMotivationLink.save();
    box.motivationLinkIds.push(newMotivationLink._id);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation link successfully" });
});
const removeMotivationLink = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    if (!boxType || typeof boxType !== "string")
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const parsedBoxType = parseInt(boxType);
    if (parsedBoxType !== motivation_2.default.boxType.bucket &&
        parsedBoxType !== motivation_2.default.boxType.counter)
        throw new HttpError_1.HttpError(400, { message: "Invalid query string" });
    const { boxId, motivationLinkId } = req.params;
    const box = parsedBoxType === motivation_2.default.boxType.bucket
        ? yield bucket_1.default.findOne({ _id: boxId })
        : yield counter_1.default.findOne({ _id: boxId });
    if (!box)
        throw new HttpError_1.HttpError(404, { message: "Box not found" });
    const motivationLink = yield motivationLink_1.default.findOne({
        _id: motivationLinkId,
    });
    if (!motivationLink)
        throw new HttpError_1.HttpError(404, { message: "Motivation link not found" });
    yield motivationLink_1.default.deleteOne({ _id: motivationLink._id });
    box.motivationLinkIds = [...box.motivationLinkIds].filter((e) => e.toString() !== motivationLinkId);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Delete motivation link successfully" });
});
exports.default = {
    getMotivationLinkIds: (0, errorWrapper_1.errorWrapper)(getMotivationLinkIds),
    createMotivationLink: (0, errorWrapper_1.errorWrapper)(createMotivationLink),
    removeMotivationLink: (0, errorWrapper_1.errorWrapper)(removeMotivationLink),
};
