import User from "@/model/user";
import Bucket from "@/model/bucket";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { bucketValidation } from "@/validation/bucket";

import {
  findUser,
  findBucket,
} from "@/controller/controller-utils-shared/find";
import { removeBucketUtil } from "@/controller/controller-utils-shared/remove";
import { duplicateBucketUtil } from "@/controller/controller-utils-shared/duplicate";
import counter from "@/model/counter";

const getBuckets = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await User.findOne({ _id: userId }).populate("bucketIds");
  if (!user) throw new HttpError(404, { message: "User not found" });

  res.status(200).json({ buckets: user.bucketIds });
};

const getBucketIds = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await findUser(userId);

  res.status(200).json({ bucketIds: user.bucketIds });
};

const createBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await findUser(userId);

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

  const user = await findUser(userId);

  const { bucketId } = req.params;

  const bucket: any = await Bucket.findOne({ _id: bucketId }).populate(
    "motivationTextIds motivationLinkIds",
    "-_id"
  );
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  const bucketData = {
    title: bucket?.title,
    motivationTexts: bucket._doc.motivationTextIds,
    motivationLinks: bucket._doc.motivationLinkIds,
  };

  const counters: any[] = await counter
    .find({ _id: { $in: bucket.counterIds } })
    .populate("motivationTextIds motivationLinkIds", "-_id");

  const countersData = counters.map((e: any) => {
    return {
      title: e.title,
      startCount: e.startCount,
      endCount: e.endCount,
      direction: e.direction,
      motivationTexts: e._doc.motivationTextIds,
      motivationLinks: e._doc.motivationLinkIds,
    };
  });

  let updatedBucketIds = [...user.bucketIds];
  const idx = updatedBucketIds.findIndex((e) => e.toString() === bucketId);
  if (idx === -1)
    throw new HttpError(500, { message: "Invalid data in bucketIds property" });

  const duplicatedBucketId = await duplicateBucketUtil(
    bucketData,
    countersData
  );

  const slicedBeforeIdx = updatedBucketIds.slice(0, idx + 1);
  const slicedAfterIdx = updatedBucketIds.slice(idx + 1);
  slicedBeforeIdx.push(duplicatedBucketId);
  updatedBucketIds = [...slicedBeforeIdx, ...slicedAfterIdx];
  user.bucketIds = updatedBucketIds;

  await user.save();

  return res.status(201).json({ message: "Duplicate bucket successfully" });
};

const mergeBuckets = async (req: Request, res: Response, _: NextFunction) => {
  const { userId } = req;

  const user = await findUser(userId);

  const { bucketIdSubject } = req.params;
  const { bucketIdObject } = req.body;

  const bucketSubject = await findBucket(bucketIdSubject);
  const bucketObject = await findBucket(bucketIdObject);

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
  const { bucketId } = req.params;

  const user = await findUser(userId);
  const bucket: any = await Bucket.findOne({ _id: bucketId }).populate(
    "counterIds"
  );

  await removeBucketUtil({ ...bucket._doc });

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
