/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  counter와 bucket 제거 관련.
*/

import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";
import AchievementStack from "@/model/history/achievementStack";
import Count from "@/model/history/count";

// counter를 제거할 때 호출 되는 유틸 함수.
export const removeCounterUtil = async (counter: any) => {
  // counter가 참조하고 있는 motivation들을 DB에서 제거.
  await MotivationText.deleteMany({ _id: { $in: counter.motivationTextIds } });
  await MotivationLink.deleteMany({ _id: { $in: counter.motivationLinkIds } });

  // counter가 참조하는 achievementStack들 DB에서 쿼리.
  const achievementStackHistory = await AchievementStack.find({
    _id: { $in: counter.achievementStackHistory },
  });
  for (const e of achievementStackHistory) {
    // achievementStack이 참조하는 count들 DB에서 제거.
    await Count.deleteMany({ _id: { $in: e.countHistory } });
  }

  // counter가 참조하는 achievementStack들 DB에서 제거.
  await AchievementStack.deleteMany({
    _id: { $in: counter.achievementStackHistory },
  });

  // counter DB에서 제거.
  await Counter.deleteOne({ _id: counter._id });

  return;
};

// bucket을 제거할 때 호출 되는 유틸 함수.
export const removeBucketUtil = async (bucket: any) => {
  // bucket이 참조하고 있는 counter들 DB에서 제거.
  bucket.counterIds.forEach((e: any) => removeCounterUtil(e));

  // bucket이 참조하고 있는 motivation들을 DB에서 제거.
  await MotivationText.deleteMany({ _id: { $in: bucket.motivationTextIds } });
  await MotivationLink.deleteMany({ _id: { $in: bucket.motivationLinkIds } });

  // bucket DB에서 제거.
  await Bucket.deleteOne({ _id: bucket._id });

  return;
};
