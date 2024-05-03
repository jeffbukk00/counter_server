import { Router } from "express";

const router = Router();

import countersController from "@/controller/counterController/counters";

router.get("/:bucketId/ids", countersController.getCounterIds);
router.post("/:bucketId", countersController.createCounter);
router.post(
  "/:bucketId/duplicate/:counterId",
  countersController.duplicateCounter
);
router.post(
  "/:bucketIdSubject/move/:counterId",
  countersController.moveCounter
);
router.delete("/:bucketId/:counterId", countersController.removeCounter);

export default router;
