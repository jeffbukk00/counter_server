// 단일 버킷에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import bucketController from "@/controller/controllers/bucketController/bucket";

// 단일 버킷을 가져오는 경로.
router.get("/:bucketId", bucketController.getBucket);

// 버킷을 수정하는 경로.
router.put("/:bucketId", bucketController.editBucket);

export default router;
