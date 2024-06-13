/*
  같은 라우터에 속한 컨트롤러들만이 공유하는 유틸 함수들.

  history 관련.
*/
import AchievementStack from "@/model/history/achievementStack";
import Count from "@/model/history/count";

import { HttpError } from "@/error/HttpError";

// achievementStack을 가져오는 유틸 함수.
export const findAchievementStack = async (achieveStackId: string) => {
  // achievementStack을 DB로부터 쿼리.
  const achievementStack = await AchievementStack.findOne({
    _id: achieveStackId,
  });

  // 존재하지 않는 achievementStack일 경우 에러 처리.
  if (!achievementStack)
    throw new HttpError(404, {
      message: "cannot find requested achievement stack",
    });

  return achievementStack;
};

// count를 가져 오는 유틸 함수.
export const findCount = async (countId: string) => {
  // count를 DB로 부터 쿼리.
  const count = await Count.findOne({ _id: countId });

  // 존재하지 않는 count일 경우 에러 처리.
  if (!count)
    throw new HttpError(404, { message: "cannot find requested count" });

  return count;
};
