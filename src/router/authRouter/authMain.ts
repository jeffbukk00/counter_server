// Oauth를 제외한 인증 로직을 위한 라우터.

// 라우터 초기화.
import { Router } from "express";
const router = Router();

// 해당 라우터에 대한 컨트롤러들.
import authMainControllers from "@/controller/controllers/authController/authMain";

// 로그인 여부를 확인하는 경로.
router.get("/logged-in", authMainControllers.checkLoggedIn);

// 로그아웃을 하기 위한 경로.
router.post("/logout", authMainControllers.logout);

export default router;
