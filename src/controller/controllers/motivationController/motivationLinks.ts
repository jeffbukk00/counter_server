import MotivationLink from "@/model/motivation/motivationLink";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationLinkValidation } from "@/validation/motivation";

import {
  validateBoxType,
  findBox,
} from "@/controller/controllers/motivationController/controller-utils-not-shared/motivations";

// motivationLink들의 id를 가져오는 역할을 하는 컨트롤러.
const getMotivationLinkIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 요청한 motivationLink들을 참조하는 박스의 타입에 대한 정보가 요청 패러미터에 저장.
  const { boxType } = req.query;

  // motivationLink들을 저장하는 박스의 타입(bucket 혹은 counter) 판별.
  const parsedBoxType = validateBoxType(boxType);

  // 요청한 motivationLink들을 참조하는 박스의 id가 요청 패러미터에 저장.
  const { boxId } = req.params;

  // motivationLink들의 id를 참조하는 박스(bucket 혹은 counter)를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  return res.status(200).json({ motivationLinkIds: box.motivationLinkIds });
};

// motivationLink를 생성하는 역할을 하는 컨트롤러.
const createMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // motivationLink를 생성할 박스의 타입(bucket 혹은 counter)에 대한 정보가 요청 패러미터에 저장.
  const { boxType } = req.query;

  // motivationLink를 생성할 박스의 타입(bucket 혹은 counter) 판별.
  const parsedBoxType = validateBoxType(boxType);

  // motivationLink를 생성할 박스의 id를 요청 패러미터에 저장.
  const { boxId } = req.params;

  // motivationLink를 생성할 박스를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  // 요청의 body에 저장된 motivationLink 생성을 위한 데이터에 대한 유효성 검사.
  const { error } = motivationLinkValidation(req.body);

  // 요청의 body에 저장된 motivationLink 생성을 위한 데이터에 대한 유효성 검사가 실패할 경우 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // motivationLink 생성.
  const { title, link } = req.body;
  const newMotivationLink = new MotivationLink({
    title,
    link,
  });

  // DB에 저장.
  await newMotivationLink.save();

  // 박스가 참조하는 motivationLink들이 담긴 배열에 생성 된 motivationLink 추가.
  box.motivationLinkIds.push(newMotivationLink._id);

  // DB에 저장.
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation link successfully" });
};

// motivationLink를 제거하는 컨트롤러
const removeMotivationLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 제거할 motivationLink를 참조하는 박스의 타입(bucket 혹은 counter)에 대한 정보가 요청 패러미터에 저장.
  const { boxType } = req.query;

  // motivationLink를 생성할 박스의 타입(bucket 혹은 counter) 판별.
  const parsedBoxType = validateBoxType(boxType);

  // 제거할 motivationLink의 id와 이를 참조하는 박스의 id가 요청 패러미터에 저장.
  const { boxId, motivationLinkId } = req.params;

  // 제거할 motivationLink를 참조하는 박스를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  // motivationLink 제거.
  await MotivationLink.deleteOne({ _id: motivationLinkId });

  // 박스가 참조하는 motivaitonLink들이 담긴 배열에서 제거 된 motivationLink를 필터링.
  box.motivationLinkIds = [...box.motivationLinkIds].filter(
    (e) => e.toString() !== motivationLinkId
  );

  // DB에 저장.
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
