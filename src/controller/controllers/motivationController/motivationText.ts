import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";

import { findMotivationText } from "@/controller/controllers/motivationController/controller-utils-not-shared/motivation";

const getMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  const motivationText = await findMotivationText(motivationTextId);

  return res.status(200).json({ motivationText });
};

const editMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  const motivationText = await findMotivationText(motivationTextId);

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
