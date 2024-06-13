// 단일 motivationText에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import motivationTextController from "@/controller/controllers/motivationController/motivationText";

// 단일 motivationText를 가져오는 경로.
router.get("/:motivationTextId", motivationTextController.getMotivationText);

// motivationText를 수정하는 경로.
router.put("/:motivationTextId", motivationTextController.editMotivationText);

export default router;
