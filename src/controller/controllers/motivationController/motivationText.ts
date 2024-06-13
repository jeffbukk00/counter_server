import { findMotivationText } from "@/controller/controllers/motivationController/controller-utils-not-shared/motivation";

import { motivationTextValidation } from "@/validation/motivation";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// 단일 motivationText를 가져오는 컨트롤러.
const getMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 요청한 motivationText의 id가 요청 패러미터에 저장.
  const { motivationTextId } = req.params;

  // 요청한 motivationText를 DB로부터 쿼리.
  const motivationText = await findMotivationText(motivationTextId);

  return res.status(200).json({ motivationText });
};

// motivationText를 수정하는 컨트롤러.
const editMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 수정 요청한 motivationText의 id를 요청 패러미터에 저장.
  const { motivationTextId } = req.params;

  // 수정 요청한 motivationText를 DB로부터 쿼리.
  const motivationText = await findMotivationText(motivationTextId);

  // 요청의 body에 저장 된 수정을 위해 업데이트 된 motivationText 데이터에 대한 유효성 검사.
  const { error } = motivationTextValidation(req.body);

  // 요청의 body에 저장 된 수정을 위해 업데이트 된 motivationText 데이터에 대한 유효성 검사 실패 시 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // motivationText 수정.
  const { text } = req.body;
  motivationText.text = text;

  // DB에 저장.
  await motivationText.save();

  return res.status(201).json({ message: "Edit motivation text successfully" });
};

export default {
  getMotivationText: errorWrapper(getMotivationText),
  editMotivationText: errorWrapper(editMotivationText),
};
