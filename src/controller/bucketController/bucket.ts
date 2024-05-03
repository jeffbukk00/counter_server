import Bucket from "@/model/bucket";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { bucketValidation } from "@/validation/bucket";

const getBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  res.status(200).json({ bucket });
};

const editBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  const { error } = bucketValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title } = req.body;
  bucket.title = title;
  await bucket.save();

  return res.status(201).json({ message: "Edit bucket successfully" });
};

export default {
  getBucket: errorWrapper(getBucket),
  editBucket: errorWrapper(editBucket),
};
