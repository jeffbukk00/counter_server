import ShareLink from "@/model/shareLink";

import { HttpError } from "@/error/HttpError";

export const findShareLink = async (
  shareLinkId: string | undefined,
  errorResponse: any
) => {
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });
  // 요청 파라미터에 포함된 share link id에 해당 되는 공유 링크가 존재하지 않는 다면, 404 에러 throw
  if (!shareLink) throw new HttpError(404, errorResponse);

  return shareLink;
};
