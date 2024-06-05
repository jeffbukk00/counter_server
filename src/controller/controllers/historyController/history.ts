import { findCounter } from "@/controller/controller-utils-shared/find";
import { errorWrapper } from "@/error/errorWrapper";

import AchievementStack from "@/model/logging/achievementStack";

import { NextFunction, Request, Response } from "@/types/express";
import {
  findAchievementStack,
  findCount,
} from "./controller-utils-not-shard/history";
import { HttpError } from "@/error/HttpError";

const getHistoryAll = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  const historyAll = await AchievementStack.find({
    _id: { $in: counter.achievementStackHistory },
  }).populate("countHistory");

  res.status(200).json({ historyAll });
};

const getAchievementStackHistoryIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  return res
    .status(200)
    .json({ achievementStackHistoryIds: counter.achievementStackHistory });
};

const getAchievementStackHistory = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { achievementStackId } = req.params;

  const achievementStack = await findAchievementStack(achievementStackId);

  return res.status(200).json({
    achievementStack: {
      _id: achievementStack._id,
      stack: achievementStack.stack,
      comment: achievementStack.comment,
      timestamp: achievementStack.timeStamp,
    },
  });
};

const getCountHistoryAll = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { achievementStackId } = req.params;

  const achievementStack = await AchievementStack.findOne({
    _id: achievementStackId,
  }).populate("countHistory");

  if (!achievementStack)
    throw new HttpError(404, {
      message: "cannot find requested achievement stack",
    });

  return res
    .status(200)
    .json({ countHistoryAll: achievementStack.countHistory });
};

const editCommentOfAchievementStackHistory = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { achievementStackId } = req.params;

  const achievementStack = await findAchievementStack(achievementStackId);

  const { updatedComment } = req.body;

  achievementStack.comment = updatedComment;
  await achievementStack.save();

  return res
    .status(201)
    .json({ message: "Successfully edit achievement stack history" });
};

const editCommentOfCountHistory = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { countId } = req.params;

  const count = await findCount(countId);

  const { updatedComment } = req.body;

  count.comment = updatedComment;
  await count.save();

  return res.status(201).json({ message: "Succesfully edit count history" });
};

export default {
  getHistoryAll: errorWrapper(getHistoryAll),
  getAchievementStackHistoryIds: errorWrapper(getAchievementStackHistoryIds),
  getAchievementStackHistory: errorWrapper(getAchievementStackHistory),
  getCountHistoryAll: errorWrapper(getCountHistoryAll),
  editCommentOfAchievementStackHistory: errorWrapper(
    editCommentOfAchievementStackHistory
  ),
  editCommentOfCountHistory: errorWrapper(editCommentOfCountHistory),
};
