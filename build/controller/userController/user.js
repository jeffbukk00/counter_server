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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    return res.status(200).json({
        userData: {
            email: user.email,
            username: user.username,
            profilePictureUrl: user.profilePictureUrl,
            unreadPositivePopupIds: user.unreadPositivePopupIds,
        },
    });
});
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
const updateUnreadPositivePopupIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    const { checkedPositivePopupId } = req.body;
    if (!checkedPositivePopupId)
        throw new HttpError_1.HttpError(400, { message: "Request has no correct body" });
    const user = yield user_1.default.findOne({ _id: userId });
    if (!user)
        throw new HttpError_1.HttpError(404, { message: "User not found" });
    user.unreadPositivePopupIds = [...user.unreadPositivePopupIds].filter((e) => e !== checkedPositivePopupId);
    yield user.save();
    return res
        .status(201)
        .json({ message: "Update unreadPositivePopupIds successfully" });
});
exports.default = {
    getUserData: (0, errorWrapper_1.errorWrapper)(getUserData),
    // updateUserProfile: errorWrapper(updateUserProfile),
    updateUnreadPositivePopupIds: (0, errorWrapper_1.errorWrapper)(updateUnreadPositivePopupIds),
};
