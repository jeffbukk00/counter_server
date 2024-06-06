import Bucket from "@/model/bucket";
import Counter from "@/model/counter";
import MotivationText from "@/model/motivation/motivationText";
import MotivationLink from "@/model/motivation/motivationLink";
import AchievementStack from "@/model/history/achievementStack";
import Count from "@/model/history/count";

export const removeCounterUtil = async (counter: any) => {
  await MotivationText.deleteMany({ _id: { $in: counter.motivationTextIds } });
  await MotivationLink.deleteMany({ _id: { $in: counter.motivationLinkIds } });

  const achievementStackHistory = await AchievementStack.find({
    _id: { $in: counter.achievementStackHistory },
  });
  for (const e of achievementStackHistory)
    await Count.deleteMany({ _id: { $in: e.countHistory } });
  await AchievementStack.deleteMany({
    _id: { $in: counter.achievementStackHistory },
  });
  await Counter.deleteOne({ _id: counter._id });
  return;
};

export const removeBucketUtil = async (bucket: any) => {
  bucket.counterIds.forEach((e: any) => removeCounterUtil(e));
  await MotivationText.deleteMany({ _id: { $in: bucket.motivationTextIds } });
  await MotivationLink.deleteMany({ _id: { $in: bucket.motivationLinkIds } });
  await Bucket.deleteOne({ _id: bucket._id });
  return;
};
