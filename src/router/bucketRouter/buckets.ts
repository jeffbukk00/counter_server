import { Router } from "express";

const router = Router();

import bucketsController from "@/controller/bucketController/buckets";

router.get("/", bucketsController.getBuckets);
router.get("/ids", bucketsController.getBucketIds);
router.post("/", bucketsController.createBucket);
router.post("/duplicate/:bucketId", bucketsController.duplicateBucket);
router.post("/merge/:bucketIdSubject", bucketsController.mergeBuckets);
router.delete("/:bucketId", bucketsController.removeBucket);

export default router;
