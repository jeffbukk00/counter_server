import { Router } from "express";

const router = Router();

import naverOauthControllers from "@/controller/authController/oauth/naver";

router.get("/oauth/url/naver", naverOauthControllers.getOauthUrlNaver);

router.post(
  "/oauth/token/naver",
  naverOauthControllers.getAccessTokenNaver,
  naverOauthControllers.loginUsingNaverOauth
);

export default router;
