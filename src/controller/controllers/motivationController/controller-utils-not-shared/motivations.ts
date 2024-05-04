import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { HttpError } from "@/error/HttpError";
import motivationConstants from "@/constants/motivation";

// 모티베이션들을 저장하는 박스의 타입(버킷 혹은 카운터) 판별하는 함수.
export const validateBoxType = (boxType: any) => {
  //  1. query string 내 "boxType" 필드가 비어 있지 않은지.
  if (!boxType) throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);

  //  2. query string 내 "boxType" 필드에 할당 된 값이 미리 지정 된 box의 type들에 해당하는지.
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  return parsedBoxType;
};

// 박스 타입(버킷 혹은 카운터)에 따라, 버킷 혹은 카운터를 가져오는 함수.
export const findBox = async (
  boxId: string | undefined,
  parsedBoxType: number
) => {
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  if (!box) throw new HttpError(404, { message: "Box not found" });

  return box;
};
