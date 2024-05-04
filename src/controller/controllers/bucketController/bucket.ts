import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { bucketValidation } from "@/validation/bucket";

import { findBucket } from "@/controller/controller-utils-shared/find";

const getBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await findBucket(bucketId);

  res.status(200).json({ bucket });
};

const editBucket = async (req: Request, res: Response, _: NextFunction) => {
  const { bucketId } = req.params;

  const bucket = await findBucket(bucketId);

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
