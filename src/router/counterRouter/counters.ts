// 복수의 카운터들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import countersController from "@/controller/controllers/counterController/counters";

// 버킷 내 존재하는 카운터들에 대한 id를 가져오는 경로.
router.get("/:bucketId/ids", countersController.getCounterIds);

router.post("/:bucketId/position", countersController.changeCounterPosition);

// 카운터를 생성하는 경로.
router.post("/:bucketId", countersController.createCounter);

// 카운터를 복제하는 경로.
router.post(
  "/:bucketId/duplicate/:counterId",
  countersController.duplicateCounter
);

// 카운터를 다른 버킷으로 이동시키는 경로.
router.post(
  "/:bucketIdSubject/move/:counterId",
  countersController.moveCounter
);

// 카운터를 제거하는 경로.
router.delete("/:bucketId/:counterId", countersController.removeCounter);

export default router;
