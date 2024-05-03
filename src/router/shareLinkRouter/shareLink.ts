import { Router } from "express";

const router = Router();

import shareLinkController from "@/controller/shareLinkController/shareLink";

router.post("/upload", shareLinkController.uploadShareLink);
router.get("/:shareLinkId/validation", shareLinkController.validateShareLink);
router.post(
  "/:shareLinkId/download/all",
  shareLinkController.downloadShareLinkAll
);
router.post(
  "/:shareLinkId/download/secure",
  shareLinkController.downloadShareLinkSecure
);

export default router;
