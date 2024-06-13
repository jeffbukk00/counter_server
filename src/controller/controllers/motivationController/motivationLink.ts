import { findMotivationLink } from "@/controller/controllers/motivationController/controller-utils-not-shared/motivation";

import { motivationLinkValidation } from "@/validation/motivation";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// 단일 motivationLink를 가져오는 역할을 하는 컨트롤러.
const getMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 요청한 motivationLink의 id가 요청 패러미터에 저장.
  const { motivationLinkId } = req.params;

  // motivationLink를 DB로부터 쿼리.
  const motivationLink = await findMotivationLink(motivationLinkId);

  return res.status(200).json({ motivationLink });
};

// motivationLink를 수정하는 역할을 하는 컨트롤러.
const editMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 수정 요청한 motivationLink의 id가 요청 패러미터에 저장.
  const { motivationLinkId } = req.params;

  // 수정 요청한 motivationLink를 DB로부터 쿼리.
  const motivationLink = await findMotivationLink(motivationLinkId);

  // 요청의 body에 저장 된 업데이트 된 motivationLink의 데이터에 대한 유효성 검사.
  const { error } = motivationLinkValidation(req.body);

  // 요청의 body에 저장 된 업데이트 된 motivationLink의 데이터에 대한 유효성 검사가 실패하는 경우 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // motivationLink 수정.
  const { title, link } = req.body;
  motivationLink.title = title;
  motivationLink.link = link;

  // DB에 저장.
  await motivationLink.save();

  return res.status(201).json({ message: "Edit motivation link successfully" });
};

export default {
  getMotivationLink: errorWrapper(getMotivationLink),
  editMotivationLink: errorWrapper(editMotivationLink),
};
