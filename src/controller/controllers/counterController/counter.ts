import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import {
  counterValidation,
  counterEditValidation,
  countUpdateValidation,
} from "@/validation/counter";
import counterConstants from "@/constants/counter";

import { findCounter } from "@/controller/controller-utils-shared/find";
import AchievementStack from "@/model/logging/achievementStack";
import Count from "@/model/logging/count";

const getCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  return res.status(200).json({ counter });
};

const editCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  const { error } = counterValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, startCount, endCount } = req.body;
  const direction =
    startCount < endCount
      ? counterConstants.direction.up
      : counterConstants.direction.down;

  counter.title = title;
  counter.startCount = startCount;
  counter.endCount = endCount;
  counter.direction = direction;

  const counterEditValidationResult = counterEditValidation(
    counter.direction,
    counter.startCount,
    counter.currentCount,
    counter.endCount
  );
  if (!counterEditValidationResult && counterEditValidationResult === false)
    throw new HttpError(400, { message: "Invalid input from client side" });

  await counter.save();

  return res.status(201).json({ message: "Edit counter successfully" });
};

const updateCount = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  const { updatedCurrentCount } = req.body;
  const countUpdateValidationResult = countUpdateValidation(
    counter.direction,
    counter.startCount,
    updatedCurrentCount,
    counter.endCount
  );
  if (!countUpdateValidationResult && countUpdateValidationResult === false)
    throw new HttpError(400, { message: "Invalid input from client side" });

  if (counter.currentCount === updatedCurrentCount)
    return res.status(201).json({ message: "Update count successfully" });

  const currentAchievementStack = await AchievementStack.findOne({
    _id: counter.achievementStackHistory[
      counter.achievementStackHistory.length - 1
    ],
  });
  if (!currentAchievementStack)
    throw new HttpError(404, {
      message: "cannot find achievement history which this count belongs to",
    });

  const offset = updatedCurrentCount - counter.currentCount!;
  const sign = Math.sign(offset);

  if (sign > 0) {
    if (counter.direction === counterConstants.direction.up) {
      const newCountHistory = new Count({
        offset,
        updatedCurrentCount,
        isPositive: true,
        isResetHistory: false,
        comment: "",
        timeStamp: new Date(),
      });

      currentAchievementStack.countHistory.push(newCountHistory._id);
      newCountHistory.save();
    } else {
      const newCountHistory = new Count({
        offset,
        updatedCurrentCount,
        isPositive: false,
        isResetHistory: false,
        comment: "",
        timeStamp: new Date(),
      });

      currentAchievementStack.countHistory.push(newCountHistory._id);
      newCountHistory.save();
    }
  } else {
    if (counter.direction === counterConstants.direction.up) {
      const newCountHistory = new Count({
        offset,
        updatedCurrentCount,
        isPositive: false,
        isResetHistory: false,
        comment: "",
        timeStamp: new Date(),
      });

      currentAchievementStack.countHistory.push(newCountHistory._id);
      newCountHistory.save();
    } else {
      const newCountHistory = new Count({
        offset,
        updatedCurrentCount,
        isPositive: true,
        isResetHistory: false,
        comment: "",
        timeStamp: new Date(),
      });

      currentAchievementStack.countHistory.push(newCountHistory._id);
      newCountHistory.save();
    }
  }

  await currentAchievementStack.save();
  counter.currentCount = updatedCurrentCount;
  await counter.save();

  return res.status(201).json({ message: "Update count successfully" });
};

const resetCount = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId, resetFlag } = req.params;

  const counter = await findCounter(counterId);

  if (counter.currentCount === counter.startCount)
    return res.status(201).json({ mesasge: "Reset count successfully" });

  if (resetFlag === counterConstants.resetFlag.resetHistroy) {
    const currentAchievementStack = await AchievementStack.findOne({
      _id: counter.achievementStackHistory[
        counter.achievementStackHistory.length - 1
      ],
    });
    if (!currentAchievementStack)
      throw new HttpError(404, {
        message: "cannot find achievement history which this count belongs to",
      });

    const newResetCountHistory = new Count({
      offset: counter.startCount! - counter.currentCount!,
      updatedCurrentCount: counter.startCount,
      isPositive: null,
      isResetHistory: true,
      comment: "",
      timeStamp: new Date(),
    });

    currentAchievementStack.countHistory.push(newResetCountHistory.id);

    await newResetCountHistory.save();
    await currentAchievementStack.save();
  }

  counter.currentCount = counter.startCount;
  await counter.save();

  return res.status(201).json({ mesasge: "Reset count successfully" });
};

const updateAchievementStack = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  const { updatedAchievementStack } = req.body;
  if (updatedAchievementStack < 0)
    throw new HttpError(400, { message: "Invalid input from client side" });

  const newAchievementHistory = new AchievementStack({
    stack: updatedAchievementStack,
    comment: "",
    countHistory: [],
    timeStamp: new Date(),
  });

  counter.achievementStack = updatedAchievementStack;
  counter.achievementStackHistory.push(newAchievementHistory._id);

  await newAchievementHistory.save();
  await counter.save();

  return res
    .status(201)
    .json({ message: "Update achievement stack successfully" });
};

const resetAchievementStack = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { counterId } = req.params;

  const counter = await findCounter(counterId);

  if (counter.achievementStackHistory.length <= 1)
    return res
      .status(201)
      .json({ message: "Reset achievement stack successfully" });

  let achievementStackHistoryIds = [...counter.achievementStackHistory];
  let achievementStackHistory = await AchievementStack.find({
    _id: { $in: counter.achievementStackHistory },
  });
  const lastHistory = achievementStackHistory.pop();
  lastHistory!.stack = 0;
  const lastHistoryId = achievementStackHistoryIds.pop();
  counter.achievementStack = 0;
  counter.achievementStackHistory = [];
  counter.achievementStackHistory.push(lastHistoryId!);

  for (const e of achievementStackHistory) {
    await Count.deleteMany({ _id: { $in: e.countHistory } });
  }

  await AchievementStack.deleteMany({
    _id: { $in: achievementStackHistoryIds },
  });

  await lastHistory?.save();
  await counter.save();

  return res
    .status(201)
    .json({ message: "Reset achievement stack successfully" });
};

export default {
  getCounter: errorWrapper(getCounter),
  editCounter: errorWrapper(editCounter),
  updateCount: errorWrapper(updateCount),
  resetCount: errorWrapper(resetCount),
  updateAchievementStack: errorWrapper(updateAchievementStack),
  resetAchievementStack: errorWrapper(resetAchievementStack),
};
