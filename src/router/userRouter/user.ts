// 인증된 유저에 대한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import userController from "@/controller/controllers/userController/user";

// 유저 데이터를 가져오는 경로.
router.get("/user-data", userController.getUserData);

// 유저 프로필을 업데이트하는 경로. => 추후 업데이트 예정.
// router.patch("/user-data/user-profile", userController.updateUserProfile);

// 유저 데이터 내 "unreadPositivePopupIds" 필드를 업데이트 하는 경로.
router.patch(
  "/user-data/unread-guide-ids",
  userController.updateUnreadGuideIds
);

export default router;
