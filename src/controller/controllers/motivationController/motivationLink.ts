import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationLinkValidation } from "@/validation/motivation";

import { findMotivationLink } from "@/controller/controllers/motivationController/controller-utils-not-shared/motivation";

// 단일 모티베이션 링크를 가져오는 역할을 하는 컨트롤러.
const getMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationLinkId } = req.params;
  // 요청 파라미터에 존재하는 motivationLinkId에 해당 하는 모티베이션 링크를 데이터베이스로부터 가져옴.
  const motivationLink = await findMotivationLink(motivationLinkId);

  return res.status(200).json({ motivationLink });
};

// 모티베이션 링크를 수정하는 역할을 하는 컨트롤러.
const editMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { motivationLinkId } = req.params;
  // 요청 파라미터에 존재하는 motivationLinkId에 해당 하는 모티베이션 링크를 데이터베이스로부터 가져옴.
  const motivationLink = await findMotivationLink(motivationLinkId);

  // 전달 된 모티베이션 링크 데이터에 대한 유효성 검사 진행.
  const { error } = motivationLinkValidation(req.body);
  // 유효성 검사를 실패한다면, 400 에러를 throw.
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
