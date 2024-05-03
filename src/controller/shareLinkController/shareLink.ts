import User from "@/model/user";
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";
import ShareLink from "@/model/shareLink";

import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";
import { Request, Response, NextFunction } from "@/types/express";

const uploadShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;

  const { bucketId } = req.body;
  const bucket = await Bucket.findOne({ _id: bucketId }).populate(
    "motivationTextIds motivationLinkIds",
    "-_id"
  );
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  const counterIds = bucket.counterIds;
  const counters = await Counter.find({ _id: { $in: counterIds } }).populate(
    "motivationTextIds motivationLinkIds",
    "-_id"
  );

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

  return res.status(201).json({ shareLink: `/sharing/${newShareLink._id}` });
};

const validateShareLink = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { shareLinkId } = req.params;
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });
  if (!shareLink) throw new HttpError(500, { isValid: false });

  const user = await User.findOne({ _id: shareLink.userId });
  let username: string | null | undefined;
  if (user) {
    username = user.username;
  } else {
    username = "(탈퇴한 유저입니다)";
  }

  return res.status(200).json({ isValid: true, username });
};

const downloadShareLinkAll = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;
  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { shareLinkId } = req.params;
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });
  if (!shareLink)
    throw new HttpError(500, { message: "This share link was expired" });

  // 버킷 생성. 버킷에 대한 모티베이션 텍스트들, 모티베이션 링크들 생성.
  const newBucket = new Bucket({
    title: shareLink.bucket?.title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  const motivationTextsInBucket = await MotivationText.insertMany(
    [...shareLink.bucket!.motivationTexts].map((e) => {
      return { text: e.text };
    })
  );
  const motivationTextIdsInBucket = [...motivationTextsInBucket].map(
    (e) => e._id
  );
  newBucket.motivationTextIds = motivationTextIdsInBucket;

  const motivationLinksInBucket = await MotivationLink.insertMany(
    [...shareLink.bucket!.motivationLinks].map((e) => {
      return { title: e.title, link: e.link };
    })
  );
  const motivationLinkIdsInBucket = [...motivationLinksInBucket].map(
    (e) => e._id
  );
  newBucket.motivationLinkIds = motivationLinkIdsInBucket;

  // 카운터들 생성. 각각의 카운터에 대한 모티베이션 텍스트들, 모티베이션 링크들 생성.
  const counterIdsInBucket: any = [];

  for (let e of [...shareLink.counters]) {
    const newCounter = new Counter({
      title: e.title,
      startCount: e.startCount,
      currentCount: 0,
      endCount: e.endCount,
      direction: e.direction,
      achievementStack: 0,
      motivationTextIds: [],
      motivationLinkIds: [],
    });

    const motivationTextsInCounter = await MotivationText.insertMany(
      [...e.motivationTexts].map((e) => {
        return { text: e.text };
      })
    );
    const motivationTextIdsInCounter = [...motivationTextsInCounter].map(
      (e) => e._id
    );
    newCounter.motivationTextIds = motivationTextIdsInCounter;

    const motivationLinksInCounter = await MotivationLink.insertMany(
      [...e.motivationLinks].map((e) => {
        return { title: e.title, link: e.link };
      })
    );
    const motivationLinkIdsInCounter = [...motivationLinksInCounter].map(
      (e) => e._id
    );
    newCounter.motivationLinkIds = motivationLinkIdsInCounter;

    await newCounter.save();

    counterIdsInBucket.push(newCounter._id);
  }

  newBucket.counterIds = counterIdsInBucket;
  await newBucket.save();

  user.bucketIds.push(newBucket._id);
  await user.save();

  return res
    .status(201)
    .json({ message: "Download from share link successfully" });
};

const downloadShareLinkSecure = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { userId } = req;
  const user = await User.findOne({ _id: userId });
  if (!user) throw new HttpError(404, { message: "User not found" });

  const { shareLinkId } = req.params;
  const shareLink = await ShareLink.findOne({ _id: shareLinkId });
  if (!shareLink)
    throw new HttpError(500, { message: "This share link was expired" });

  // 버킷 생성. 버킷에 대한 모티베이션 텍스트들 생성. 모티베이션 링크들 제외.
  const newBucket = new Bucket({
    title: shareLink.bucket?.title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  const motivationTextsInBucket = await MotivationText.insertMany(
    [...shareLink.bucket!.motivationTexts].map((e) => {
      return { text: e.text };
    })
  );
  const motivationTextIdsInBucket = [...motivationTextsInBucket].map(
    (e) => e._id
  );
  newBucket.motivationTextIds = motivationTextIdsInBucket;

  // 카운터들 생성. 각각의 카운터에 대한 모티베이션 텍스트들 생성, 모티베이션 링크들은 제외.
  const counterIdsInBucket: any = [];

  for (let e of [...shareLink.counters]) {
    const newCounter = new Counter({
      title: e.title,
      startCount: e.startCount,
      currentCount: 0,
      endCount: e.endCount,
      direction: e.direction,
      achievementStack: 0,
      motivationTextIds: [],
      motivationLinkIds: [],
    });

    const motivationTextsInCounter = await MotivationText.insertMany(
      [...e.motivationTexts].map((e) => {
        return { text: e.text };
      })
    );
    const motivationTextIdsInCounter = [...motivationTextsInCounter].map(
      (e) => e._id
    );
    newCounter.motivationTextIds = motivationTextIdsInCounter;

    await newCounter.save();

    counterIdsInBucket.push(newCounter._id);
  }

  newBucket.counterIds = counterIdsInBucket;
  await newBucket.save();

  user.bucketIds.push(newBucket._id);
  await user.save();

  return res
    .status(201)
    .json({ message: "Download from share link successfully" });
};

export default {
  uploadShareLink: errorWrapper(uploadShareLink),
  validateShareLink: errorWrapper(validateShareLink),
  downloadShareLinkAll: errorWrapper(downloadShareLinkAll),
  downloadShareLinkSecure: errorWrapper(downloadShareLinkSecure),
};
