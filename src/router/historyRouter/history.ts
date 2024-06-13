// history에 대한 라우터

import { Router } from "express";
import historyController from "@/controller/controllers/historyController/history";

// 라우터 초기화.
const router = Router();

// counter에 속한 모든 history들을 가져오는 경로.
router.get("/all/:counterId", historyController.getHistoryAll);

// counter에 속한 모든 achievementStack의 id들을 가져오는 경로.
router.get(
  "/achievement-stack/ids/:counterId",
  historyController.getAchievementStackHistoryIds
);

// 단일 achievementStack을 가져오는 경로.
router.get(
  "/achievement-stack/:achievementStackId",
  historyController.getAchievementStackHistory
);

// achievementStack에 속한 모든 count들을 가져오는 경로.
router.get("/counts/:achievementStackId", historyController.getCountHistoryAll);

// achievementStack의 comment를 수정하는 경로.
router.patch(
  "/achievement-stack/edit/:achievementStackId",
  historyController.editCommentOfAchievementStackHistory
);

// count의 comment를 수정하는 경로.
router.patch(
  "/count/edit/:countId",
  historyController.editCommentOfCountHistory
);

export default router;
