import MotivationText from "@/model/motivation/motivationText";

import { motivationTextValidation } from "@/validation/motivation";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

import {
  validateBoxType,
  findBox,
} from "@/controller/controllers/motivationController/controller-utils-not-shared/motivations";

// 박스가 참조하는 모든 motivationText들의 id를 가져오는 컨트롤러.
const getMotivationTextIds = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 요청한 motivationText들을 참조하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
  const { boxType } = req.query;

  // 요청한 motivationText들을 참조하는 박스의 타입(bucket or counter)를 판별.
  const parsedBoxType = validateBoxType(boxType);

  // 요청한 motivationText들을 참조하는 박스의 id를 요청 패러미터에 저장.
  const { boxId } = req.params;

  // 요청한 motivationText들을 참조하는 박스를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  return res.status(200).json({ motivationTextIds: box.motivationTextIds });
};

// motivationText를 생성하기 위한 컨트롤러.
const createMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // motivationText을 생성하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
  const { boxType } = req.query;

  // motivationText를 생성 요청한 박스의 타입(bucket or counter)를 판별.
  const parsedBoxType = validateBoxType(boxType);

  // motivationText를 생성 요청한 박스의 id를 요청 패러미터에 저장.
  const { boxId } = req.params;

  //  motivationText를 생성 요청한 박스를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  // 요청의 body에 저장된 motivationText 생성을 위한 데이터에 대한 유효성 검사.
  const { error } = motivationTextValidation(req.body);

  // 요청의 body에 저장된 motivationText 생성을 위한 데이터에 대한 유효성 검사 실패 시 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // motivationText 생성.
  const { text } = req.body;
  const newMotivationText = new MotivationText({
    text,
  });

  // motivationText 저장.
  await newMotivationText.save();

  // 박스가 참조하는 motivationText들을 담고 있는 배열에 생성 된 motivationText에 대한 참조를 추가.
  box.motivationTextIds.push(newMotivationText._id);

  // DB에 저장.
  await box.save();

  return res
    .status(201)
    .json({ message: "Create motivation text successfully" });
};

// motivationText를 제거하기 위한 컨트롤러.
const removeMotivationText = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // 제거할 motivationText를 참조하는 박스의 타입(bucket or counter)에 대한 정보를 요청 패러미터에 저장.
  const { boxType } = req.query;

  // 제거할 motivationText를 참조하는 박스의 타입(bucket or counter) 판별.
  const parsedBoxType = validateBoxType(boxType);

  // 제거할 motivationText의 id와 이를 참조하는 박스의 id를 요청 패러미터에 저장.
  const { boxId, motivationTextId } = req.params;

  // 제거할 motivationText를 참조하는 박스를 DB로부터 쿼리.
  const box = await findBox(boxId, parsedBoxType);

  // motivationText 제거.
  await MotivationText.deleteOne({ _id: motivationTextId });

  // 박스가 참조하는 motivationText들을 담은 배열에서 삭제 된 motivationText를 필터링.
  box.motivationTextIds = [...box.motivationTextIds].filter(
    (e) => e.toString() !== motivationTextId
  );

  // DB에 저장.
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
