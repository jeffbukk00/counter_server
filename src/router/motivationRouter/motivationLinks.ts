// 복수의 motivationLink들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationLinksController from "@/controller/controllers/motivationController/motivationLinks";

// motivationLink들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationLinksController.getMotivationLinkIds);

// motivationLink를 생성하기 위한 경로.
router.post("/:boxId", motivationLinksController.createMotivationLink);

// motivationLink를 제거하기 위한 경로.
router.delete(
  "/:boxId/:motivationLinkId",
  motivationLinksController.removeMotivationLink
);

export default router;
