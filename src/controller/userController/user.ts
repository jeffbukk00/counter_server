import User from "@/model/user";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });
  return res.status(200).json({
    userData: {
      email: user.email,
      username: user.username,
      profilePictureUrl: user.profilePictureUrl,
      unreadPositivePopupIds: user.unreadPositivePopupIds,
    },
  });
};

// const updateUserProfile = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {};

const updateUnreadPositivePopupIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;
  const { checkedPositivePopupId } = req.body;
  if (!checkedPositivePopupId)
    throw new HttpError(400, { message: "Request has no correct body" });

  const user = await User.findOne({ _id: userId });

  if (!user) throw new HttpError(404, { message: "User not found" });

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
