import { Router } from "express";

const router = Router();

import motivationsController from "@/controller/motivationController/motivations";

router.get("/:boxId/ids", motivationsController.getMotivationIds);
router.post("/:boxId/text", motivationsController.createMotivationText);
router.post("/:boxId/link", motivationsController.createMotivationLink);
router.delete("/:boxId/:motivationId", motivationsController.removeMotivation);

export default router;
