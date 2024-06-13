// 복수의 counter들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import countersController from "@/controller/controllers/counterController/counters";

// bucket 내 존재하는 counter들에 대한 id를 가져오는 경로.
router.get("/:bucketId/ids", countersController.getCounterIds);

// counter들의 위치를 업데이트 하기 위한 경로.
router.post("/:bucketId/position", countersController.changeCounterPosition);

// counter를 생성하는 경로.
router.post("/:bucketId", countersController.createCounter);

// counter를 복제하는 경로.
router.post(
  "/:bucketId/duplicate/:counterId",
  countersController.duplicateCounter
);

// counter를 다른 bucket으로 이동시키는 경로.
router.post(
  "/:bucketIdSubject/move/:counterId",
  countersController.moveCounter
);

// counter를 제거하는 경로.
router.delete("/:bucketId/:counterId", countersController.removeCounter);

export default router;
