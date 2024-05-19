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
      unreadGuideIds: user.unreadGuideIds,
    },
  });
};

// 유저 프로필을 업데이트 하기 위한 컨트롤러. => 추후 업데이트 예정.
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

// "unreadPositivePopupIds" 필드를 업데이트 하기 위한 컨트롤러.
const updateUnreadGuideIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { checkedGuideId } = req.body;

  if (!checkedGuideId)
    throw new HttpError(400, { message: "Request has no correct body" });

  const { userId } = req;
  // 데이터베이스로부터 유저 데이터를 가져옴.
  const user = await findUser(userId);

  user.unreadGuideIds = [...user.unreadGuideIds].filter(
    (e) => e !== checkedGuideId
  );
  await user.save();

  return res
    .status(201)
    .json({ message: "Update unreadGuideIds successfully" });
};

export default {
  getUserData: errorWrapper(getUserData),
  // updateUserProfile: errorWrapper(updateUserProfile),
  updateUnreadGuideIds: errorWrapper(updateUnreadGuideIds),
};
