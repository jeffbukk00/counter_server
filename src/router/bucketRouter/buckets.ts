// 복수의 bucket들에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import bucketsController from "@/controller/controllers/bucketController/buckets";

// 유저가 가진 bucket들을 가져오기 위한 경로.
router.get("/", bucketsController.getBuckets);

// 유저가 가진 bucket들의 id를 가져오기 위한 경로.
router.get("/ids", bucketsController.getBucketIds);

// bucket들의 위치를 업데이트 하기 위한 경로.
router.post("/position", bucketsController.changeBucketPosition);

// bucket을 생성하는 경로.
router.post("/", bucketsController.createBucket);

// bucket을 복제하는 경로.
router.post("/duplicate/:bucketId", bucketsController.duplicateBucket);

// 서로 다른 두 bucket들을 병합하는 경로.
router.post("/merge/:bucketIdSubject", bucketsController.mergeBuckets);

// bucket을 삭제하는 경로.
router.delete("/:bucketId", bucketsController.removeBucket);

export default router;
