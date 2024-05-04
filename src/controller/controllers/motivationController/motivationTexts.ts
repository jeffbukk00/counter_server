import MotivationText from "@/model/motivation/motivationText";

import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { motivationTextValidation } from "@/validation/motivation";

import {
  validateBoxType,
  findBox,
} from "@/controller/controllers/motivationController/controller-utils-not-shared/motivations";

// 모티베이션 텍스트들의 id를 가져오기 위한 컨트롤러.
const getMotivationTextIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
  const { boxId } = req.params;
  const box = await findBox(boxId, parsedBoxType);

  return res.status(200).json({ motivationTextIds: box.motivationTextIds });
};

// 모티베이션 텍스트를 생성하기 위한 컨트롤러.
const createMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId } = req.params;
  // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  // 모티베이션 텍스트 생성에 대한 유효성 검사.
  const { error } = motivationTextValidation(req.body);
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // 모티베이션 텍스트 생성 및 저장.
  const { text } = req.body;
  const newMotivationText = new MotivationText({
    text,
  });
  await newMotivationText.save();

  // 생성 된 모티베이션 텍스트를 참조하는 박스(버킷 혹은 카운터) 업데이트 및 저장.
  box.motivationTextIds.push(newMotivationText._id);
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation text successfully" });
};

// 모티베이션 텍스트를 제거하기 위한 컨트롤러.
const removeMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { boxType } = req.query;
  // 모티베이션 텍스트들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별.
  const parsedBoxType = validateBoxType(boxType);

  const { boxId, motivationTextId } = req.params;
  // 모티베이션 텍스트들의 id가 포함 된 박스(버킷 혹은 카운터)를 가져옴.
  const box = await findBox(boxId, parsedBoxType);

  // 모티베이션 텍스트 제거.
  await MotivationText.deleteOne({ _id: motivationTextId });

  // 제거 된 모티베이션 텍스를 참조하는 박스(버킷 혹은 카운터) 업데이트 및 저장.
  box.motivationTextIds = [...box.motivationTextIds].filter(
    (e) => e.toString() !== motivationTextId
  );
  await box.save();

  return res
    .status(201)
    .json({ message: "Delete motivation text successfully" });
};

export default {
  getMotivationTextIds: errorWrapper(getMotivationTextIds),
  createMotivationText: errorWrapper(createMotivationText),
  removeMotivationText: errorWrapper(removeMotivationText),
};
