// 단일 motivationLink에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationLinkController from "@/controller/controllers/motivationController/motivationLink";

// 단일 motivationLink를 가져오는 경로.
router.get("/:motivationLinkId", motivationLinkController.getMotivationLink);

// motivationLink를 수정하는 경로.
router.put("/:motivationLinkId", motivationLinkController.editMotivationLink);

export default router;
