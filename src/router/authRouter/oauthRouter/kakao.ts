import { Router } from "express";

const router = Router();

import kakaoOauthControllers from "@/controller/authController/oauth/kakao";

router.get("/oauth/url/kakao", kakaoOauthControllers.getOauthUrlKakao);

router.post(
  "/oauth/token/kakao",
  kakaoOauthControllers.getAccessTokenKakao,
  kakaoOauthControllers.loginUsingKakaoOauth
);

export default router;
