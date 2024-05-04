import MotivationLink from "@/model/motivation/motivationLink";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationLinkValidation } from "@/validation/motivation";

import {
  validateBoxType,
  findBox,
} from "@/controller/controllers/motivationController/controller-utils-not-shared/motivations";

// 모티베이션 링크들의 id를 가져오는 역할을 하는 컨트롤러.
const getMotivationLinkIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
};

// 모티베이션 링크를 생성하는 역할을 하는 컨트롤러.
const createMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  // 전달 된 모티베이션 링크 데이터에 대한 유효성 검사 진행.
  const { error } = motivationLinkValidation(req.body);
  // 유효성 검사를 실패한다면, 400 에러를 throw.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title, link } = req.body;
  const newMotivationLink = new MotivationLink({
    title,
    link,
  });
  await newMotivationLink.save();

  // 새롭게 생성된 모티베이션 링크의 id를 박스(버킷 혹은 카운터)에 추가한 뒤, 저장.
  box.motivationLinkIds.push(newMotivationLink._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation link successfully" });
};

const removeMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 요청의 query string 내 boxType에 대한 유효성 검사 진행.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId, motivationLinkId } = req.params;

  // 요청 파라미터로 전달 된 box id에 해당하는 버킷 혹은 카운터를 데이터베이스로부터 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  await MotivationLink.deleteOne({ _id: motivationLinkId });

  box.motivationLinkIds = [...box.motivationLinkIds].filter(
    (e) => e.toString() !== motivationLinkId
  );
  await box.save();

  return res
    .status(201)
    .json({ message: "Delete motivation link successfully" });
};

export default {
  getMotivationLinkIds: errorWrapper(getMotivationLinkIds),
  createMotivationLink: errorWrapper(createMotivationLink),
  removeMotivationLink: errorWrapper(removeMotivationLink),
};
