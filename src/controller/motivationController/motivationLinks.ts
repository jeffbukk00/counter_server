import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationLink from "@/model/motivation/motivationLink";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationLinkValidation } from "@/validation/motivation";
import motivationConstants from "@/constants/motivation";

const getMotivationLinkIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  if (!boxType || typeof boxType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  const { boxId } = req.params;
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });

  return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
};

const createMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  if (!boxType || typeof boxType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  const { boxId } = req.params;
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });

  const { error } = motivationLinkValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, link } = req.body;
  const newMotivationLink = new MotivationLink({
    title,
    link,
  });
  await newMotivationLink.save();

  box.motivationLinkIds.push(newMotivationLink._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation link successfully" });
};

const removeMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  if (!boxType || typeof boxType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  const { boxId, motivationLinkId } = req.params;

  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });

  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });
  if (!motivationLink)
    throw new HttpError(404, { message: "Motivation link not found" });

  await MotivationLink.deleteOne({ _id: motivationLink._id });

  box.motivationLinkIds = [...box.motivationLinkIds].filter(
    (e) => e.toString() !== motivationLinkId
  );
  await box.save();

  return res
    .status(201)
    .json({ message: "Delete motivation link successfully" });
};

export default {
  getMotivationLinkIds: errorWrapper(getMotivationLinkIds),
  createMotivationLink: errorWrapper(createMotivationLink),
  removeMotivationLink: errorWrapper(removeMotivationLink),
};
