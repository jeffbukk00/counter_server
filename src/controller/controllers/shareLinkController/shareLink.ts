import User from "@/model/user";
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import ShareLink from "@/model/shareLink";

import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { Request, Response, NextFunction } from "@/types/express";

import { duplicateBucketUtil } from "@/controller/controller-utils-shared/duplicate";

import { findShareLink } from "@/controller/controllers/shareLinkController/controller-utils-not-shared/shareLink";

// 공유 링크를 데이터베이스에 업로드(생성)하기 위한 컨트롤러.
const uploadShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;

  const { bucketId } = req.body;

  // 공유할 버킷을 데이터베이스로부터 가져옴.
  const bucket = await Bucket.findOne({ _id: bucketId }).populate(
    "counterIds motivationTextIds motivationLinkIds"
  );
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  // 공유할 버킷 내에 존재하는 카운터들을 데이터베이스로부터 가져옴.
  const counters = await Counter.populate(
    bucket.counterIds,
    "motivationTextIds motivationLinkIds"
  );

  // 위에서 가져온 데이터들을 바탕으로, 공유 링크 생성 및 저장.
  const sharedBucket = {
    title: bucket.title,
    motivationTexts: bucket.motivationTextIds,
    motivationLinks: bucket.motivationLinkIds,
  };

  const sharedCounters = [...counters].map((e) => {
    return {
      title: e.title,
      startCount: e.startCount,
      endCount: e.endCount,
      direction: e.direction,
      motivationTexts: e.motivationTextIds,
      motivationLinks: e.motivationLinkIds,
    };
  });

  const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  const newShareLink = new ShareLink({
    bucket: sharedBucket,
    counters: sharedCounters,
    userId,
    expirationDate,
  });
  await newShareLink.save();

  // 생성된 공유 링크의 id가 포함 된 경로를 응답 데이터로 함.
  return res.status(201).json({ shareLink: `/sharing/${newShareLink._id}` });
};

// 공유 링크로부터 버킷을 다운로드 하기 전, 이것의 유효성 및 안전성을 확인하는 역할을 하는 컨트롤러.
const validateShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { shareLinkId } = req.params;

  // 공유 링크를 데이터베이스로부터 가져옴.
  // 일치하는 공유 링크가 존재한다면, 유효한 공유 링크.
  const shareLink = await findShareLink(shareLinkId, { isValid: false });

  // 공유 링크를 업로드(생성)한 유저를 데이터베이스로부터 가져옴.
  const user = await User.findOne({ _id: shareLink.userId });
  let username: string | null | undefined;
  if (user) {
    username = user.username;
  } else {
    username = "(탈퇴한 유저입니다)";
  }

  // 공유 링크의 유효성 및 안전성 여부와 이를 생성한 유저의 이름을 응답 데이터로 함.
  return res.status(200).json({ isValid: true, username });
};

// 공유 링크로부터 버킷을 다운로드 하기 위한 컨트롤러.
const downloadShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;
  // 요청한 유저를 데이터베이스로부터 가져옴.
  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { shareLinkId, downloadType } = req.params;
  // 공유 링크 및 공유할 버킷 데이터를 데이터베이스로부터 가져옴.
  const shareLink = await findShareLink(shareLinkId, {
    message: "This share link was expired",
  });

  // 공유할 버킷 데이터를 데이터베이스 내 복제
  const duplicatedBucketId = await duplicateBucketUtil(
    shareLink.bucket,
    shareLink.counters,
    downloadType
  );

  // 복제된 버킷을 다운로드를 요청한 유저가 참조하는 버킷 리스트에 추가 및 저장.
  user.bucketIds.push(duplicatedBucketId);
  await user.save();

  return res
    .status(201)
    .json({ message: "Download from share link successfully" });
};

export default {
  uploadShareLink: errorWrapper(uploadShareLink),
  validateShareLink: errorWrapper(validateShareLink),
  downloadShareLink: errorWrapper(downloadShareLink),
};
