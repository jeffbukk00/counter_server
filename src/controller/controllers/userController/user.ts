import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

import { findUser } from "@/controller/controller-utils-shared/find";

// 유저 데이터를 가져오는 역할을 하는 컨트롤러.
const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  // 데이터베이스로부터 유저 데이터를 쿼리하는 함수.
  const user = await findUser(userId);

  return res.status(200).json({
    userData: {
      email: user.email,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
      unreadPositivePopupIds: user.unreadPositivePopupIds,
    },
  });
};

// 유저 프로필을 업데이트 하기 위한 컨트롤러. => 추후 업데이트 예정.
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// 유저 데이터 내 "unreadPositivePopupIds" 필드를 업데이트 하기 위한 컨트롤러.
const updateUnreadPositivePopupIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { checkedPositivePopupId } = req.body;
  // 요청의 body 내 "checkedPositivePopupId" 필드에 어떠한 값도 할당 되어 있지 않다면, 400 에러를 throw.
  if (!checkedPositivePopupId)
    throw new HttpError(400, { message: "Request has no correct body" });

  const { userId } = req;
  // 데이터베이스로부터 유저 데이터를 쿼리하는 함수.
  const user = await findUser(userId);

  // 유저 데이터 내 'unreadPositivePopupIds' 필드의 배열 업데이트.
  // 요청의 body로 전달 된 'checkedPositivePopupId'와 일치하는 요소를 기존 배열에서 제거.
  user.unreadPositivePopupIds = [...user.unreadPositivePopupIds].filter(
    (e) => e !== checkedPositivePopupId
  );
  await user.save();

  return res
    .status(201)
    .json({ message: "Update unreadPositivePopupIds successfully" });
};

export default {
  getUserData: errorWrapper(getUserData),
  // updateUserProfile: errorWrapper(updateUserProfile),
  updateUnreadPositivePopupIds: errorWrapper(updateUnreadPositivePopupIds),
};
