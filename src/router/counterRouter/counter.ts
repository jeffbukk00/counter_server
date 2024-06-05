// 단일 카운터에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import counterController from "@/controller/controllers/counterController/counter";

// 단일 카운터를 가져오는 경로.
router.get("/:counterId", counterController.getCounter);

// 카운터를 수정하는 경로.
router.put("/:counterId", counterController.editCounter);

// 카운터의 카운트("currentCount" 필드)를 업데이트하는 경로.
router.patch("/count/:counterId", counterController.updateCount);

// 카운터의 카운트("currentCount" 필드)를 리셋하는 경로.
router.patch(
  "/count/reset/:counterId/:resetFlag",
  counterController.resetCount
);

// 카운터의 성취 스택("achievementStack" 필드)를 업데이트 하는 경로.
router.patch(
  "/achievement-stack/:counterId",
  counterController.updateAchievementStack
);

// 카운터의 성취 스택("achievementStack" 필드)를 리셋 하는 경로.
router.patch(
  "/achievement-stack/reset/:counterId",
  counterController.resetAchievementStack
);
export default router;
