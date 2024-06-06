import Counter from "@/model/counter";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { counterValidation } from "@/validation/counter";
import counterConstants from "@/constants/counter";

import {
  findBucket,
  findCounter,
} from "@/controller/controller-utils-shared/find";
import { removeCounterUtil } from "@/controller/controller-utils-shared/remove";
import { duplicateCounterUtil } from "@/controller/controller-utils-shared/duplicate";
import AchievementStack from "@/model/history/achievementStack";

const getCounterIds = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await findBucket(bucketId);

  return res.status(200).json({ counterIds: bucket.counterIds });
};

const changeCounterPosition = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { bucketId } = req.params;

  const { counterIds } = req.body;

  const bucket = await findBucket(bucketId);
  bucket.counterIds = counterIds;
  await bucket.save();

  return res
    .status(201)
    .json({ message: "Change counter's position successfully" });
};

const createCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await findBucket(bucketId);

  const { error } = counterValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, startCount, endCount } = req.body;
  const direction =
    startCount < endCount
      ? counterConstants.direction.up
      : counterConstants.direction.down;

  const initialAchievementHistory = new AchievementStack({
    isAchieved: false,
    stack: 0,
    comment: "",
    countHistory: [],
    createdAt: new Date(),
    achievedAt: null,
  });

  const newCounter = new Counter({
    title,
    startCount,
    currentCount: startCount,
    endCount,
    direction,
    achievementStack: 0,
    achievementStackHistory: [initialAchievementHistory],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  await initialAchievementHistory.save();
  await newCounter.save();

  bucket.counterIds.push(newCounter._id);
  await bucket.save();

  return res.status(201).json({ message: "Create counter successfully" });
};

const duplicateCounter = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { bucketId, counterId } = req.params;

  const bucket = await findBucket(bucketId);
  const counter: any = await Counter.findOne({ _id: counterId }).populate(
    "motivationTextIds motivationLinkIds",
    "-_id"
  );
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  const counterData = {
    title: counter.title,
    startCount: counter.startCount,
    endCount: counter.endCount,
    direction: counter.direction,
    motivationTexts: counter._doc.motivationTextIds,
    motivationLinks: counter._doc.motivationLinkIds,
  };

  let updatedCounterIds = [...bucket.counterIds];
  const idx = updatedCounterIds.findIndex((e) => e.toString() === counterId);
  if (idx === -1)
    throw new HttpError(500, {
      message: "Invalid data in counterIds property",
    });

  const duplicatedCounterId = await duplicateCounterUtil(counterData);

  const slicedBeforeIdx = updatedCounterIds.slice(0, idx + 1);
  const slicedAfterIdx = updatedCounterIds.slice(idx + 1);
  slicedBeforeIdx.push(duplicatedCounterId);
  updatedCounterIds = [...slicedBeforeIdx, ...slicedAfterIdx];
  bucket.counterIds = updatedCounterIds;

  await bucket.save();

  return res.status(201).json({ message: "Duplicate counter successfully" });
};

const moveCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketIdSubject, counterId } = req.params;
  const { bucketIdObject } = req.body;

  const bucketSubject = await findBucket(bucketIdSubject);
  const bucketObject = await findBucket(bucketIdObject);
  const counter = await findCounter(counterId);

  bucketSubject.counterIds = [...bucketSubject.counterIds].filter(
    (e) => e.toString() !== counterId
  );
  bucketObject.counterIds.push(counter._id);
  await bucketSubject.save();
  await bucketObject.save();

  return res.status(201).json({ message: "Move counter successfully" });
};

const removeCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId, counterId } = req.params;

  const bucket = await findBucket(bucketId);
  const counter = await findCounter(counterId);

  await removeCounterUtil(counter);

  bucket.counterIds = [...bucket.counterIds].filter(
    (e) => e.toString() !== counterId
  );
  await bucket.save();

  return res.status(201).json({ message: "Delete counter successfully" });
};

export default {
  getCounterIds: errorWrapper(getCounterIds),
  changeCounterPosition: errorWrapper(changeCounterPosition),
  createCounter: errorWrapper(createCounter),
  duplicateCounter: errorWrapper(duplicateCounter),
  moveCounter: errorWrapper(moveCounter),
  removeCounter: errorWrapper(removeCounter),
};
