import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { HttpError } from "@/error/HttpError";
import motivationConstants from "@/constants/motivation";

// 요청의 query string으로 전달 된 boxType에 대한 유효성 검사.
export const validateBoxType = (boxType: any) => {
  //  1. boxType이 query string 내에 존재하는지
  if (!boxType) throw new HttpError(400, { message: "Invalid query string" });
  const parsedBoxType = parseInt(boxType);

  //  2. 요청의 query string으로 전달 된 boxType이 미리 지정 된 box의 type에 해당하는지.
  if (
    parsedBoxType !== motivationConstants.boxType.bucket &&
    parsedBoxType !== motivationConstants.boxType.counter
  )
    throw new HttpError(400, { message: "Invalid query string" });

  return parsedBoxType;
};

export const findBox = async (
  boxId: string | undefined,
  parsedBoxType: number
) => {
  // 전달 된 boxType에 따라 버킷을 가져올 지, 카운터를 가져올 지 결정.
  const box =
    parsedBoxType === motivationConstants.boxType.bucket
      ? await Bucket.findOne({ _id: boxId })
      : await Counter.findOne({ _id: boxId });
  // 요청 파라미터로 전달 된 box id에 해당하는 버킷 및 카운터가 존재하지 않는다면, 404 에러를 throw.
  if (!box) throw new HttpError(404, { message: "Box not found" });

  return box;
};
