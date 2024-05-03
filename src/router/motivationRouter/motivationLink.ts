import { Router } from "express";

const router = Router();

import motivationLinkController from "@/controller/motivationController/motivationLink";

router.get("/:motivationLinkId", motivationLinkController.getMotivationLink);
router.put("/:motivationLinkId", motivationLinkController.editMotivationLink);

export default router;
