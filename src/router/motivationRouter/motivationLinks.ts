// 복수의 모티베이션 링크들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationLinksController from "@/controller/controllers/motivationController/motivationLinks";

// 모티베이션 링크들의 id를 가져오기 위한 경로.
router.get("/:boxId/ids", motivationLinksController.getMotivationLinkIds);

// 모티베이션 링크를 생성하기 위한 경로.
router.post("/:boxId", motivationLinksController.createMotivationLink);

// 모티베이션 링크를 제거하기 위한 경로.
router.delete(
  "/:boxId/:motivationLinkId",
  motivationLinksController.removeMotivationLink
);

export default router;
