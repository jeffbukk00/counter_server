import MotivationText from "@/model/motivation/motivationText";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";

import {
  validateBoxType,
  findBox,
} from "@/controller/controllers/motivationController/controller-utils-not-shared/motivations";

const getMotivationTextIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  const box = await findBox(boxId, parsedBoxType);

  return res.status(200).json({ motivationTextIds: box.motivationTextIds });
};

const createMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  console.log(boxType);
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  const box = await findBox(boxId, parsedBoxType);

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
  const parsedBoxType = validateBoxType(boxType);

  const { boxId, motivationTextId } = req.params;
  const box = await findBox(boxId, parsedBoxType);

  await MotivationText.deleteOne({ _id: motivationTextId });

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
