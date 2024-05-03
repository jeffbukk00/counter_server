import { Router } from "express";

const router = Router();

import motivationLinksController from "@/controller/motivationController/motivationLinks";

router.get("/:boxId/ids", motivationLinksController.getMotivationLinkIds);
router.post("/:boxId", motivationLinksController.createMotivationLink);
router.delete(
  "/:boxId/:motivationLinkId",
  motivationLinksController.removeMotivationLink
);

export default router;
