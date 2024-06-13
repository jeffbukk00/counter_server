import { findUser } from "@/controller/controller-utils-shared/find";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// 유저 데이터를 가져오는 역할을 하는 컨트롤러.
const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  // 요청한 유저의 id를 request 객체에 저장.
  const { userId } = req;

  // 요청한 유저를 DB로부터 쿼리.
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

// 유저 가이드를 업데이트 하기 위한 컨트롤러.
const updateUnreadGuideIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 읽었음을 체크한 가이드의 id가 요청의 body에 저장.
  const { checkedGuideId } = req.body;

  // 존재하지 않는 가이드 id에 대한 에러 처리.
  if (!checkedGuideId)
    throw new HttpError(400, { message: "Request has no correct body" });

  // 요청한 유저의 id를 request 객체로부터 가져옴.
  const { userId } = req;

  // 요청한 유저를 DB로부터 쿼리.
  const user = await findUser(userId);

  // 유저의 읽지 않은 가이드 목록에서 읽은 가이드를 필터링.
  user.unreadGuideIds = [...user.unreadGuideIds].filter(
    (e) => e !== checkedGuideId
  );

  // DB에 저장.
  await user.save();

  return res
    .status(201)
    .json({ message: "Update unreadGuideIds successfully" });
};

// 유저 프로필을 업데이트 하기 위한 컨트롤러. => 추후 업데이트 예정.
// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

export default {
  getUserData: errorWrapper(getUserData),
  updateUnreadGuideIds: errorWrapper(updateUnreadGuideIds),
  // updateUserProfile: errorWrapper(updateUserProfile),
};
