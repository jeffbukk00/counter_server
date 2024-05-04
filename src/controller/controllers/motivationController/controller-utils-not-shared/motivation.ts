import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";

import { HttpError } from "@/error/HttpError";

export const findMotivationLink = async (
  motivationLinkId: string | undefined
) => {
  const motivationLink = await MotivationLink.findOne({
    _id: motivationLinkId,
  });
  // motivationLinkId에 해당 하는 모티베이션 링크가 존재하지 않는다면, 404 에러를 throw.
  if (!motivationLink)
    throw new HttpError(404, { message: "Motivation link not found" });

  return motivationLink;
};

export const findMotivationText = async (
  motivationTextId: string | undefined
) => {
  const motivationText = await MotivationText.findOne({
    _id: motivationTextId,
  });
  // motivationTextId에 해당 하는 모티베이션 텍스트가 존재하지 않는다면, 404 에러를 throw.
  if (!motivationText)
    throw new HttpError(404, { message: "Motivation text not found" });

  return motivationText;
};
