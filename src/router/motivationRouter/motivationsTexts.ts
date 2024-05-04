// 복수의 모티베이션 텍스트들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationTextsController from "@/controller/controllers/motivationController/motivationTexts";

// 모티베이션 텍스트들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationTextsController.getMotivationTextIds);

// 모티베이션 텍스트를 생성하기 위한 경로.
router.post("/:boxId", motivationTextsController.createMotivationText);

// 모티베이션 텍스트를 제거하기 위한 경로.
router.delete(
  "/:boxId/:motivationTextId",
  motivationTextsController.removeMotivationText
);

export default router;
