import { Router } from "express";

const router = Router();

import userController from "@/controller/userController/user";

router.get("/user-data", userController.getUserData);

// router.patch("/user-data/user-profile", userController.updateUserProfile);

router.patch(
  "/user-data/unread-positive-popup-ids",
  userController.updateUnreadPositivePopupIds
);

export default router;
