import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import {
  motivationTextValidation,
  motivationLinkValidation,
} from "@/validation/motivation";
import motivationConstants from "@/constants/motivation";

const getMotivationIds = async (
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

  return res.status(200).json({ motivationIds: box.motivationIds });
};

const createMotivationText = async (
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

  const { error } = motivationTextValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { text } = req.body;
  const newMotivationText = new MotivationText({
    type: motivationConstants.motivationType.text,
    text,
  });
  await newMotivationText.save();

  box.motivationIds.push(newMotivationText._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation text successfully" });
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
    type: motivationConstants.motivationType.link,
    title,
    link,
  });
  await newMotivationLink.save();

  box.motivationIds.push(newMotivationLink._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation link successfully" });
};

const removeMotivation = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType, motivationType } = req.query;
  if (!boxType || typeof boxType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });
  if (!motivationType || typeof motivationType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedMotivationType = parseInt(motivationType);
  if (
    parsedMotivationType !== motivationConstants.motivationType.text &&
    parsedMotivationType !== motivationConstants.motivationType.link
  )
    throw new HttpError(400, { message: "Invalid query string" });

  const { boxId, motivationId } = req.params;
  console.log(boxId);
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });
  const motivation =
    parsedMotivationType === motivationConstants.motivationType.text
      ? await MotivationText.findOne({ _id: motivationId })
      : await MotivationLink.findOne({ _id: motivationId });
  if (!motivation)
    throw new HttpError(404, { message: "Motivation not found" });

  if (parsedMotivationType === motivationConstants.motivationType.text)
    await MotivationText.deleteOne({ _id: motivation._id });
  else await MotivationLink.deleteOne({ _id: motivation._id });

  box.motivationIds = [...box.motivationIds].filter(
    (e) => e.toString() !== motivationId
  );
  await box.save();

  return res.status(201).json({ message: "Delete motivation successfully" });
};

export default {
  getMotivationIds: errorWrapper(getMotivationIds),
  createMotivationText: errorWrapper(createMotivationText),
  createMotivationLink: errorWrapper(createMotivationLink),
  removeMotivation: errorWrapper(removeMotivation),
};
