import { HttpError } from "@/error/HttpError";
import AchievementStack from "@/model/history/achievementStack";
import Count from "@/model/history/count";

export const findAchievementStack = async (achieveStackId: string) => {
  const achievementStack = await AchievementStack.findOne({
    _id: achieveStackId,
  });
  if (!achievementStack)
    throw new HttpError(404, {
      message: "cannot find requested achievement stack",
    });

  return achievementStack;
};

export const findCount = async (countId: string) => {
  const count = await Count.findOne({ _id: countId });
  if (!count)
    throw new HttpError(404, { message: "cannot find requested count" });

  return count;
};
