import { Router } from "express";

const router = Router();

import googleOauthControllers from "@/controller/authController/oauth/google";

router.get("/oauth/url/google", googleOauthControllers.getOauthUrlGoogle);

router.post(
  "/oauth/token/google",
  googleOauthControllers.getAccessTokenGoogle,
  googleOauthControllers.loginUsingGoogleOauth
);

export default router;
