import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";

import { HttpError } from "@/error/HttpError";

// 모티베이션 텍스트를 가져오는 함수.
export const findMotivationText = async (
  motivationTextId: string | undefined
) => {
  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });
  if (!motivationText)
    throw new HttpError(404, { message: "Motivation text not found" });

  return motivationText;
};

// 모티베이션 링크를 가져오는 함수.
export const findMotivationLink = async (
  motivationLinkId: string | undefined
) => {
  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });
  if (!motivationLink)
    throw new HttpError(404, { message: "Motivation link not found" });

  return motivationLink;
};
