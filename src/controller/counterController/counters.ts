import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { counterValidation } from "@/validation/counter";
import counterConstants from "@/constants/counter";

const getCounterIds = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  return res.status(200).json({ counterIds: bucket.counterIds });
};

const createCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  const { error } = counterValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, startCount, endCount } = req.body;
  const direction =
    startCount < endCount
      ? counterConstants.direction.up
      : counterConstants.direction.down;
  const newCounter = new Counter({
    title,
    startCount,
    currentCount: startCount,
    endCount,
    direction,
    achievementStack: 0,
    motivationTextIds: [],
    motivationLinkIds: [],
  });
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

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });
  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  const duplicatedCounter = new Counter({
    title: counter.title,
    startCount: counter.startCount,
    currentCount: counter.startCount,
    endCount: counter.endCount,
    direction: counter.direction,
    achievementStack: 0,
    motivationTextIds: [],
    motivationLinkIds: [],
  });
  await duplicatedCounter.save();

  let updatedCounterIds = [...bucket.counterIds];
  const idx = updatedCounterIds.findIndex((e) => e.toString() === counterId);
  if (idx === -1)
    throw new HttpError(500, {
      message: "Invalid data in counterIds property",
    });
  const slicedBeforeIdx = updatedCounterIds.slice(0, idx + 1);
  const slicedAfterIdx = updatedCounterIds.slice(idx + 1);
  slicedBeforeIdx.push(duplicatedCounter._id);
  updatedCounterIds = [...slicedBeforeIdx, ...slicedAfterIdx];
  bucket.counterIds = updatedCounterIds;
  await bucket.save();

  return res.status(201).json({ message: "Duplicate counter successfully" });
};

const moveCounter = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketIdSubject, counterId } = req.params;
  const { bucketIdObject } = req.body;

  const bucketSubject = await Bucket.findOne({ _id: bucketIdSubject });
  if (!bucketSubject)
    throw new HttpError(404, { message: "Subject bucket not found" });
  const bucketObject = await Bucket.findOne({ _id: bucketIdObject });
  if (!bucketObject)
    throw new HttpError(404, { message: "Object bucket not found" });
  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

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

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });
  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  await Counter.deleteOne({ _id: counterId });

  bucket.counterIds = [...bucket.counterIds].filter(
    (e) => e.toString() !== counterId
  );
  await bucket.save();

  return res.status(201).json({ message: "Delete counter successfully" });
};

export default {
  getCounterIds: errorWrapper(getCounterIds),
  createCounter: errorWrapper(createCounter),
  duplicateCounter: errorWrapper(duplicateCounter),
  moveCounter: errorWrapper(moveCounter),
  removeCounter: errorWrapper(removeCounter),
};
