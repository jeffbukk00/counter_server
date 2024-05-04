import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";

import { findMotivationText } from "@/controller/controllers/motivationController/controller-utils-not-shared/motivation";

// 단일 모티베이션 텍스트를 가져오는 컨트롤러.
const getMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  // 모티베이션 텍스트를 가져옴.
  const motivationText = await findMotivationText(motivationTextId);

  return res.status(200).json({ motivationText });
};

// 모티베이션 텍스트를 수정하는 컨트롤러.
const editMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationTextId } = req.params;
  // 수정할 모티베이션 텍스트를 가져옴.
  const motivationText = await findMotivationText(motivationTextId);

  // 모티베이션 텍스트 수정에 대한 유효성 검사.
  const { error } = motivationTextValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // 모티베이션 텍스트 수정 및 저장.
  const { text } = req.body;
  motivationText.text = text;
  await motivationText.save();

  return res.status(201).json({ message: "Edit motivation text successfully" });
};

export default {
  getMotivationText: errorWrapper(getMotivationText),
  editMotivationText: errorWrapper(editMotivationText),
};
