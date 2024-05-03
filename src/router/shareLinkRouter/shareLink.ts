import { Router } from "express";

const router = Router();

import shareLinkController from "@/controller/shareLinkController/shareLink";

router.post("/upload", shareLinkController.uploadShareLink);
router.post("/:shareLinkId/validation", shareLinkController.validateShareLink);
router.get(
  "/:shareLinkId/download/all",
  shareLinkController.downloadShareLinkAll
);
router.get(
  "/:shareLinkId/download/secure",
  shareLinkController.downloadShareLinkSecure
);

export default router;
