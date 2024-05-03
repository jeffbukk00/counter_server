import { Router } from "express";

const router = Router();

import motivationTextsController from "@/controller/motivationController/motivationTexts";

router.get("/:boxId/ids", motivationTextsController.getMotivationTextIds);
router.post("/:boxId", motivationTextsController.createMotivationText);
router.delete(
  "/:boxId/:motivationTextId",
  motivationTextsController.removeMotivationText
);

export default router;
