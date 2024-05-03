import MotivationText from "@/model/motivation/motivationText";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";

const getMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });
  if (!motivationText)
    throw new HttpError(404, { message: "Motivation text not found" });

  return res.status(200).json({ motivationText });
};

const editMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });
  if (!motivationText) throw new HttpError(404, "Motivation text not found");

  const { error } = motivationTextValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { text } = req.body;
  motivationText.text = text;
  await motivationText.save();

  return res.status(201).json({ message: "Edit motivation text successfully" });
};

export default {
  getMotivationText: errorWrapper(getMotivationText),
  editMotivationText: errorWrapper(editMotivationText),
};
