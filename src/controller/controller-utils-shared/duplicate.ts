/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  bucket과 counter 복제 관련.
*/

import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";
import AchievementStack from "@/model/history/achievementStack";

import sharedConstants from "@/constants/shared";

// bucket과 counter에 motivationText들을 복제할 때 호출 되는 유틸 함수.
export const insertMotivationTexts = async (motivationTexts: any) => {
  // motivationText들을 생성 및 DB에 저장해서 복제.
  const insertedMotivationTexts = await MotivationText.insertMany(
    motivationTexts.map((e: any) => {
      return { text: e.text };
    })
  );

  // 복제될 bucket 또는 counter이 복제된 motivationText들을 참조.
  const motivationTextIds = [...insertedMotivationTexts].map((e) => e._id);

  return motivationTextIds;
};

// bucket과 counter에 motivationLink들을 복제 할 때 호출 되는 유틸 함수.
export const insertMotivationLinks = async (motivationLinks: any) => {
  // motivationLink들을 생성 및 DB에 저장해서 복제.
  const insertedMotivationLinks = await MotivationLink.insertMany(
    motivationLinks.map((e: any) => {
      return { title: e.title, link: e.link };
    })
  );
  // 복제될 bucket 또는 counter이 복제된 motivationLink들을 참조.
  const motivationLinkIds = [...insertedMotivationLinks].map((e) => e._id);

  return motivationLinkIds;
};

// counter를 복제할 때 호출 되는 유틸 함수.
export const duplicateCounterUtil = async (
  counter: any,
  duplicateType: string = sharedConstants.duplicateType.all
) => {
  // 최초의 achievementStack 생성.
  const initialAchievementHistory = new AchievementStack({
    isAchieved: false,
    stack: 0,
    comment: "",
    countHistory: [],
    createdAt: new Date(),
    achievedAt: null,
  });

  // counter 생성 및 최초의 achievementStack 참조.
  const newCounter = new Counter({
    title: counter.title,
    startCount: counter.startCount,
    currentCount: counter.startCount,
    endCount: counter.endCount,
    direction: counter.direction,
    achievementStack: 0,
    achievementStackHistory: [initialAchievementHistory],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  // 생성 된 counter에 motivation들을 복제.
  newCounter.motivationTextIds = await insertMotivationTexts([
    ...counter.motivationTexts,
  ]);

  if (duplicateType === sharedConstants.duplicateType.all) {
    // 안전한 타입의 복제(공유)일 경우, motivationLink를 제외하고 복제.
    newCounter.motivationLinkIds = await insertMotivationLinks([
      ...counter.motivationLinks,
    ]);
  }

  // DB에 저장.
  await initialAchievementHistory.save();
  await newCounter.save();

  return newCounter._id;
};

// bucket을 복제할 때 호출 되는 유틸 함수.
export const duplicateBucketUtil = async (
  bucket: any,
  counters: any,
  duplicateType: string = sharedConstants.duplicateType.all
) => {
  // 새로운 bucket 생성.
  const newBucket = new Bucket({
    title: bucket.title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  // 생성 된 counter에 motivation들을 복제.
  newBucket.motivationTextIds = await insertMotivationTexts([
    ...bucket.motivationTexts,
  ]);
  if (duplicateType === sharedConstants.duplicateType.all) {
    // 안전한 타입의 복제(공유)일 경우, motivationLink를 제외하고 복제.
    newBucket.motivationLinkIds = await insertMotivationLinks([
      ...bucket.motivationLinks,
    ]);
  }

  // 생성 된 bucket에 counter들에 대한 참조를 복제.
  for (const e of counters) {
    const duplicatedCounterId = await duplicateCounterUtil(e, duplicateType);
    newBucket.counterIds.push(duplicatedCounterId);
  }

  // DB에 저장.
  await newBucket.save();

  return newBucket._id;
};
