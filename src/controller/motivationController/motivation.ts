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

const getMotivation = async (req: Request, res: Response, _: NextFunction) => {
  const { motivationType } = req.query;
  if (!motivationType || typeof motivationType !== "string")
    throw new HttpError(400, { message: "Invalid query string" });
  const parsedMotivationType = parseInt(motivationType);
  if (
    parsedMotivationType !== motivationConstants.motivationType.text &&
    parsedMotivationType !== motivationConstants.motivationType.link
  )
    throw new HttpError(400, { message: "Invalid query string" });

  const { motivationId } = req.params;
  const motivation =
    parsedMotivationType === motivationConstants.motivationType.text
      ? await MotivationText.findOne({ _id: motivationId })
      : await MotivationLink.findOne({ _id: motivationId });
  if (!motivation)
    throw new HttpError(404, { message: "Motivation not found" });

  return res.status(200).json({ motivation });
};

const editMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationId } = req.params;
  const motivationText = await MotivationText.findOne({ _id: motivationId });
  if (!motivationText) throw new HttpError(404, "Motivation text not found");

  const { error } = motivationTextValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { text } = req.body;
  motivationText.text = text;
  await motivationText.save();

  return res.status(201).json({ message: "Edit motivation text successfully" });
};

const editMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationId } = req.params;
  const motivationLink = await MotivationLink.findOne({ _id: motivationId });
  if (!motivationLink) throw new HttpError(404, "Motivation link not found");

  const { error } = motivationLinkValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, link } = req.body;
  motivationLink.title = title;
  motivationLink.link = link;
  await motivationLink.save();

  return res.status(201).json({ message: "Edit motivation link successfully" });
};

export default {
  getMotivation: errorWrapper(getMotivation),
  editMotivationText: errorWrapper(editMotivationText),
  editMotivationLink: errorWrapper(editMotivationLink),
};
