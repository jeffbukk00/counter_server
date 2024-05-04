import ShareLink from "@/model/shareLink";

import { HttpError } from "@/error/HttpError";

// 공유 링크를 데이터베이스로부터 가져오는 함수.
export const findShareLink = async (
  shareLinkId: string | undefined,
  errorResponse: any
) => {
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });
  if (!shareLink) throw new HttpError(404, errorResponse);

  return shareLink;
};
