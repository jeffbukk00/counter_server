/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  shareLink 관련.
*/
import ShareLink from "@/model/shareLink";

import { HttpError } from "@/error/HttpError";

// shareLink를 가져오는 함수.
export const findShareLink = async (
  shareLinkId: string | undefined,
  errorResponse: any
) => {
  // shareLink를 DB로부터 쿼리.
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });

  // 존재하지 않는 shareLink에 대한 에러 처리.
  if (!shareLink) throw new HttpError(404, errorResponse);

  return shareLink;
};
