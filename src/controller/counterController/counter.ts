import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import {
  counterValidation,
  counterEditValidation,
  countUpdateValidation,
} from "@/validation/counter";
import counterConstants from "@/constants/counter";

const getCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  return res.status(200).json({ counter });
};

const editCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

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

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  const { updatedCurrentCount } = req.body;
  const countUpdateValidationResult = countUpdateValidation(
    counter.direction,
    counter.startCount,
    updatedCurrentCount,
    counter.endCount
  );
  if (!countUpdateValidationResult && countUpdateValidationResult === false)
    throw new HttpError(400, { message: "Invalid input from client side" });

  counter.currentCount = updatedCurrentCount;
  await counter.save();

  return res.status(201).json({ message: "Update count successfully" });
};

const resetCount = async (req: Request, res: Response, _: NextFunction) => {
  const { counterId } = req.params;

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

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

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  const { updatedAchievementStack } = req.body;
  if (updatedAchievementStack < 0)
    throw new HttpError(400, { message: "Invalid input from client side" });

  counter.achievementStack = updatedAchievementStack;
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

  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  counter.achievementStack = 0;
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
