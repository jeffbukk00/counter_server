import { Router } from "express";

const router = Router();

import counterController from "@/controller/counterController/counter";

router.get("/:counterId", counterController.getCounter);
router.put("/:counterId", counterController.editCounter);
router.patch("/count/:counterId", counterController.updateCount);
router.patch("/count/reset/:counterId", counterController.resetCount);
router.patch(
  "/achievement-stack/:counterId",
  counterController.updateAchievementStack
);
router.patch(
  "/achievement-stack/reset/:counterId",
  counterController.resetAchievementStack
);
export default router;
