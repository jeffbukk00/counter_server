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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
const find_1 = require("@/controller/controller-utils-shared/find");
// 유저 데이터를 가져오는 역할을 하는 컨트롤러.
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req;
    // 데이터베이스로부터 유저 데이터를 쿼리하는 함수.
    const user = yield (0, find_1.findUser)(userId);
    return res.status(200).json({
        userData: {
            email: user.email,
            username: user.username,
            profilePictureUrl: user.profilePictureUrl,
            unreadGuideIds: user.unreadGuideIds,
        },
    });
});
// 유저 프로필을 업데이트 하기 위한 컨트롤러. => 추후 업데이트 예정.
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
// "unreadPositivePopupIds" 필드를 업데이트 하기 위한 컨트롤러.
const updateUnreadGuideIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    const { checkedGuideId } = req.body;
    if (!checkedGuideId)
        throw new HttpError_1.HttpError(400, { message: "Request has no correct body" });
    const { userId } = req;
    // 데이터베이스로부터 유저 데이터를 가져옴.
    const user = yield (0, find_1.findUser)(userId);
    user.unreadGuideIds = [...user.unreadGuideIds].filter((e) => e !== checkedGuideId);
    yield user.save();
    return res
        .status(201)
        .json({ message: "Update unreadGuideIds successfully" });
});
exports.default = {
    getUserData: (0, errorWrapper_1.errorWrapper)(getUserData),
    // updateUserProfile: errorWrapper(updateUserProfile),
    updateUnreadGuideIds: (0, errorWrapper_1.errorWrapper)(updateUnreadGuideIds),
};
