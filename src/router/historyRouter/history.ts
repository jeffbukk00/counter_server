import { Router } from "express";
import historyController from "@/controller/controllers/historyController/history";

const router = Router();

router.get("/all/:counterId", historyController.getHistoryAll);
router.get(
  "/achievement-stack/ids/:counterId",
  historyController.getAchievementStackHistoryIds
);
router.get(
  "/achievement-stack/:achievementStackId",
  historyController.getAchievementStackHistory
);
router.get("/counts/:achievementStackId", historyController.getCountHistoryAll);
router.patch(
  "/achievement-stack/edit/:achievementStackId",
  historyController.editCommentOfAchievementStackHistory
);
router.patch(
  "/count/edit/:countId",
  historyController.editCommentOfCountHistory
);

export default router;
