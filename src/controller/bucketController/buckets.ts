import User from "@/model/user";
import Bucket from "@/model/bucket";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { bucketValidation } from "@/validation/bucket";

const getBuckets = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId }).populate("bucketIds");
  if (!user) throw new HttpError(404, { message: "User not found" });

  res.status(200).json({ buckets: user.bucketIds });
};

const getBucketIds = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  res.status(200).json({ bucketIds: user.bucketIds });
};

const createBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { error } = bucketValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title } = req.body;
  const newBucket = new Bucket({
    title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });
  await newBucket.save();

  user.bucketIds.push(newBucket._id);
  await user.save();

  res.status(201).json({ message: "Create bucket successfully" });
};

const duplicateBucket = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { bucketId } = req.params;

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  const duplicatedBucket = new Bucket({
    title: bucket.title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });
  await duplicatedBucket.save();

  let updatedBucketIds = [...user.bucketIds];
  const idx = updatedBucketIds.findIndex((e) => e.toString() === bucketId);
  if (idx === -1)
    throw new HttpError(500, { message: "Invalid data in bucketIds property" });
  const slicedBeforeIdx = updatedBucketIds.slice(0, idx + 1);
  const slicedAfterIdx = updatedBucketIds.slice(idx + 1);
  slicedBeforeIdx.push(duplicatedBucket._id);
  updatedBucketIds = [...slicedBeforeIdx, ...slicedAfterIdx];
  user.bucketIds = updatedBucketIds;
  await user.save();

  return res.status(201).json({ message: "Duplicate bucket successfully" });
};

const mergeBuckets = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { bucketIdSubject } = req.params;
  const { bucketIdObject } = req.body;

  const bucketSubject = await Bucket.findOne({ _id: bucketIdSubject });
  if (!bucketSubject)
    throw new HttpError(404, { message: "Subject bucket not found" });
  const bucketObject = await Bucket.findOne({ _id: bucketIdObject });
  if (!bucketObject)
    throw new HttpError(404, { message: "Object bucket not found" });

  bucketSubject.counterIds = [...bucketSubject.counterIds].concat([
    ...bucketObject.counterIds,
  ]);
  bucketSubject.motivationTextIds = [...bucketSubject.motivationTextIds].concat(
    [...bucketObject.motivationTextIds]
  );
  bucketSubject.motivationLinkIds = [...bucketSubject.motivationLinkIds].concat(
    [...bucketObject.motivationLinkIds]
  );

  await bucketSubject.save();
  await Bucket.deleteOne({ _id: bucketIdObject });

  user.bucketIds = [...user.bucketIds].filter(
    (e) => e.toString() !== bucketIdObject
  );
  await user.save();

  return res.status(201).json({ message: "Merge buckets successfully" });
};

const removeBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { bucketId } = req.params;
  await Bucket.deleteOne({ _id: bucketId });

  user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketId);
  await user.save();

  return res.status(201).json({ message: "Remove bucket successfully" });
};

export default {
  getBuckets: errorWrapper(getBuckets),
  getBucketIds: errorWrapper(getBucketIds),
  createBucket: errorWrapper(createBucket),
  duplicateBucket: errorWrapper(duplicateBucket),
  mergeBuckets: errorWrapper(mergeBuckets),
  removeBucket: errorWrapper(removeBucket),
};
