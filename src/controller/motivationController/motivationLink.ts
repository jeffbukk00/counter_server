import MotivationLink from "@/model/motivation/motivationLink";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationLinkValidation } from "@/validation/motivation";

const getMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationLinkId } = req.params;
  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });
  if (!motivationLink)
    throw new HttpError(404, { message: "Motivation link not found" });

  return res.status(200).json({ motivationLink });
};

const editMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationLinkId } = req.params;
  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });
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
  getMotivationLink: errorWrapper(getMotivationLink),
  editMotivationLink: errorWrapper(editMotivationLink),
};
