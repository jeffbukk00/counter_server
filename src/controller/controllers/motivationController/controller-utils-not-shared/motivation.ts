/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  단일 motivation 관련.
*/
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";

import { HttpError } from "@/error/HttpError";

// motivationText를 가져오는 함수.
export const findMotivationText = async (
  motivationTextId: string | undefined
) => {
  // motivationText를 DB로부터 쿼리.
  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });

  // motivationText가 존재하지 않는 경우 에러 처리.
  if (!motivationText)
    throw new HttpError(404, { message: "Motivation text not found" });

  return motivationText;
};

// motivationLink를 가져오는 함수.
export const findMotivationLink = async (
  motivationLinkId: string | undefined
) => {
  // motivationLink를 DB로부터 쿼리.
  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });

  // motivationLink가 존재하지 않는 경우 에러 처리.
  if (!motivationLink)
    throw new HttpError(404, { message: "Motivation link not found" });

  return motivationLink;
};
