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
const errorWrapper_1 = require("@/error/errorWrapper");
const HttpError_1 = require("@/error/HttpError");
// 유저 데이터를 가져오는 역할을 하는 컨트롤러.
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청한 유저의 id를 request 객체에 저장.
    const { userId } = req;
    // 요청한 유저를 DB로부터 쿼리.
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
// 유저 가이드를 업데이트 하기 위한 컨트롤러.
const updateUnreadGuideIds = (req, res, _) => __awaiter(void 0, void 0, void 0, function* () {
    // 읽었음을 체크한 가이드의 id가 요청의 body에 저장.
    const { checkedGuideId } = req.body;
    // 존재하지 않는 가이드 id에 대한 에러 처리.
    if (!checkedGuideId)
        throw new HttpError_1.HttpError(400, { message: "Request has no correct body" });
    // 요청한 유저의 id를 request 객체로부터 가져옴.
    const { userId } = req;
    // 요청한 유저를 DB로부터 쿼리.
    const user = yield (0, find_1.findUser)(userId);
    // 유저의 읽지 않은 가이드 목록에서 읽은 가이드를 필터링.
    user.unreadGuideIds = [...user.unreadGuideIds].filter((e) => e !== checkedGuideId);
    // DB에 저장.
    yield user.save();
    return res
        .status(201)
        .json({ message: "Update unreadGuideIds successfully" });
});
// 유저 프로필을 업데이트 하기 위한 컨트롤러. => 추후 업데이트 예정.
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};
exports.default = {
    getUserData: (0, errorWrapper_1.errorWrapper)(getUserData),
    updateUnreadGuideIds: (0, errorWrapper_1.errorWrapper)(updateUnreadGuideIds),
    // updateUserProfile: errorWrapper(updateUserProfile),
};
