/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  다수 motivation들 관련.
*/
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import motivationConstants from "@/constants/motivation";
import { HttpError } from "@/error/HttpError";

// motivation들을 저장하는 박스의 타입(bucket 혹은 counter인지) 판별하는 유틸 함수.
export const validateBoxType = (boxType: any) => {
  //  query string 내 "boxType" 필드가 비어 있는 경우 에러 처리.
  if (!boxType) throw new HttpError(400, { message: "Invalid query string" });

  // number type으로 변환된 box의 type.
  const parsedBoxType = parseInt(boxType);

  //  query string 내 "boxType" 필드에 할당 된 값이 미리 지정 된 box의 type들에 해당하지 않는 경우 에러 처리.
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  return parsedBoxType;
};

// 박스 타입(bucket 혹은 counter)에 따라, bucket 혹은 counter를 가져오는 함수.
export const findBox = async (
  boxId: string | undefined,
  parsedBoxType: number
) => {
  // 박스 타입에 따라 bucket 혹은 counter를 DB로부터 쿼리.
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });

  // 존재하지 않는 박스일 경우 에러 처리.
  if (!box) throw new HttpError(404, { message: "Box not found" });

  return box;
};
