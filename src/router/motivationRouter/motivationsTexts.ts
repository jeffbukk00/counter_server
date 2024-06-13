// 복수의 motivationText들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationTextsController from "@/controller/controllers/motivationController/motivationTexts";

// motivationText들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationTextsController.getMotivationTextIds);

// motivationText를 생성하기 위한 경로.
router.post("/:boxId", motivationTextsController.createMotivationText);

// motivationText를 제거하기 위한 경로.
router.delete(
  "/:boxId/:motivationTextId",
  motivationTextsController.removeMotivationText
);

export default router;
