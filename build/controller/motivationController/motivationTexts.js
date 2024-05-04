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
const motivationText_1 = __importDefault(require("@/model/motivation/motivationText"));
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const motivation_1 = require("@/validation/motivation");
const motivations_1 = require("./controller-utils-not-shared/motivations");
const getMotivationTextIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    return res.status(200).json({ motivationTextIds: box.motivationTextIds });
});
const createMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId } = req.params;
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    const { error } = (0, motivation_1.motivationTextValidation)(req.body);
    if (error)
        throw new HttpError_1.HttpError(400, { message: error.details[0].message });
    const { text } = req.body;
    const newMotivationText = new motivationText_1.default({
        text,
    });
    yield newMotivationText.save();
    box.motivationTextIds.push(newMotivationText._id);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Create motivation text successfully" });
});
const removeMotivationText = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { boxType } = req.query;
    const parsedBoxType = (0, motivations_1.validateBoxType)(boxType);
    const { boxId, motivationTextId } = req.params;
    const box = yield (0, motivations_1.findBox)(boxId, parsedBoxType);
    yield motivationText_1.default.deleteOne({ _id: motivationTextId });
    box.motivationTextIds = [...box.motivationTextIds].filter((e) => e.toString() !== motivationTextId);
    yield box.save();
    return res
        .status(201)
        .json({ message: "Delete motivation text successfully" });
});
exports.default = {
    getMotivationTextIds: (0, errorWrapper_1.errorWrapper)(getMotivationTextIds),
    createMotivationText: (0, errorWrapper_1.errorWrapper)(createMotivationText),
    removeMotivationText: (0, errorWrapper_1.errorWrapper)(removeMotivationText),
};
