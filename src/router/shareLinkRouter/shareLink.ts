// 공유 링크에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import shareLinkController from "@/controller/controllers/shareLinkController/shareLink";

// 공유 링크를 데이터베이스에 업로드(생성)하는 경로.
router.post("/upload", shareLinkController.uploadShareLink);

// 공유 링크로부터 버킷을 다운로드 하기 전, 이것의 유효성 및 안전성을 확인하기 위한 경로.
router.post("/:shareLinkId/validation", shareLinkController.validateShareLink);

// 공유 링크로부터 버킷을 다운로드 하는 경로.
router.post(
  "/:shareLinkId/download/:downloadType",
  shareLinkController.downloadShareLink
);

export default router;
