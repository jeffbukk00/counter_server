import { Router } from "express";

import confirmAuthorized from "@/middlewares/confirmAuthorized";
import { errorWrapper } from "@/error/errorWrapper";

const router = Router();

import userController from "@/controller/userController/user";

router.use("/", confirmAuthorized);

router.get("/user-data", userController.getUserData);

router.patch("/user-data/user-profile", userController.updateUserProfile);

router.patch(
  "/user-data/unread-positive-popup-ids",
  userController.updateUnreadPositivePopupIds
);

export default router;
