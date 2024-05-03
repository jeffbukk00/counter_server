import { Router } from "express";

const router = Router();

import motivationTextController from "@/controller/motivationController/motivationText";

router.get("/:motivationTextId", motivationTextController.getMotivationText);
router.put("/:motivationTextId", motivationTextController.editMotivationText);

export default router;
