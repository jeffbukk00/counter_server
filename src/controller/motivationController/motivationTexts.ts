import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";
import motivationConstants from "@/constants/motivation";

const getMotivationTextIds = async (
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

  return res.status(200).json({ motivationTextIds: box.motivationTextIds });
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
    text,
  });
  await newMotivationText.save();

  box.motivationTextIds.push(newMotivationText._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation text successfully" });
};

const removeMotivationText = async (
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

  const { boxId, motivationTextId } = req.params;

  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });

  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });
  if (!motivationText)
    throw new HttpError(404, { message: "Motivation text not found" });

  await MotivationText.deleteOne({ _id: motivationText._id });

  box.motivationTextIds = [...box.motivationTextIds].filter(
    (e) => e.toString() !== motivationTextId
  );
  await box.save();

  return res
    .status(201)
    .json({ message: "Delete motivation text successfully" });
};

export default {
  getMotivationTextIds: errorWrapper(getMotivationTextIds),
  createMotivationText: errorWrapper(createMotivationText),
  removeMotivationText: errorWrapper(removeMotivationText),
};
