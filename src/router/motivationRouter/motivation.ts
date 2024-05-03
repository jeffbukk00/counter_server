import { Router } from "express";

const router = Router();

import motivationController from "@/controller/motivationController/motivation";

router.get("/:motivationId", motivationController.getMotivation);
router.put("/text/:motivationId", motivationController.editMotivationText);
router.put("/link/:motivationId", motivationController.editMotivationLink);

export default router;
