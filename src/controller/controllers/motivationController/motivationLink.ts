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
  // 모티베이션 링크를 가져옴.
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
  // 모티베이션 링크를 가져옴.
  const motivationLink = await findMotivationLink(motivationLinkId);

  // 모티베이션 링크 수정에 대한 유효성 검사.
  const { error } = motivationLinkValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // 모티베이션 링크 수정 및 저장.
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
