import { Router } from "express";

const router = Router();

import bucketController from "@/controller/bucketController/bucket";

router.get("/:bucketId", bucketController.getBucket);

router.put("/:bucketId", bucketController.editBucket);

export default router;
