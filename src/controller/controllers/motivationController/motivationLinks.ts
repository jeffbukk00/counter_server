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
  // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
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
  // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  // 모티베이션 링크 생성에 대한 유효성 검사 진행.
  const { error } = motivationLinkValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // 모티베이션 링크 생성 및 저장.
  const { title, link } = req.body;
  const newMotivationLink = new MotivationLink({
    title,
    link,
  });
  await newMotivationLink.save();

  // 생성 된 모티베이션 링크를 참조하는 박스(버킷 혹은 카운터) 업데이트.
  box.motivationLinkIds.push(newMotivationLink._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation link successfully" });
};

// 모티베이션 링크를 제거하는 컨트롤러
const removeMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 모티베이션 링크들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId, motivationLinkId } = req.params;

  // 모티베이션 링크들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  // 모티베이션 링크 제거.
  await MotivationLink.deleteOne({ _id: motivationLinkId });

  // 제거 된 모티베이션 링크를 참조하는 박스(버킷 혹은 카운터) 업데이트.
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
