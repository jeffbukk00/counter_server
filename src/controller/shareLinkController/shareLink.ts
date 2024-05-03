import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";
import ShareLink from "@/model/shareLink";

import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { Request, Response, NextFunction } from "@/types/express";

const uploadShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;

  const { sharedBucketId } = req.body;
  const sharedBucket = await Bucket.findOne({ _id: sharedBucketId });
  if (!sharedBucket) throw new HttpError(404, { message: "Bucket not found" });
};
const validateShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {};
const downloadShareLinkAll = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {};
const downloadShareLinkSecure = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {};

export default {
  uploadShareLink: errorWrapper(uploadShareLink),
  validateShareLink: errorWrapper(validateShareLink),
  downloadShareLinkAll: errorWrapper(downloadShareLinkAll),
  downloadShareLinkSecure: errorWrapper(downloadShareLinkSecure),
};
