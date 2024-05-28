import axios from "axios";
import jwt from "jsonwebtoken";

import User from "@/model/user";

import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import {
  configKakao,
  authParamsKakao,
  getTokenParamsKakao,
} from "@/config/authConfig/oauth/kakao";
import { Request, Response, NextFunction } from "@/types/express";
import { configJwtToken } from "@/config/authConfig/token";

const getOauthUrlKakao = (_: Request, res: Response) => {
  res.json({
    loginUrl: `${configKakao.authUrl}?${authParamsKakao}`,
  });
};

const getAccessTokenKakao = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.query;
  if (!code)
    throw new HttpError(400, {
      message: "Authorization code must be provided",
    });

  const tokenParam = getTokenParamsKakao(code);
  const headers = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };
  const {
    data: { access_token },
  } = await axios.post(`${configKakao.tokenUrl}?${tokenParam}`, { headers });

  if (!access_token)
    throw new HttpError(400, { message: "Cannot get access token" });

  req.accessToken = access_token;
  return next();
};

const loginUsingKakaoOauth = async (req: Request, res: Response) => {
  const { accessToken } = req;

  if (!accessToken)
    throw new HttpError(400, { message: "Cannot get access token" });

  const headers = {
    Authorization: "Bearer " + accessToken,
    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  const {
    data: {
      id,
      properties: { nickname: name, thumbnail_image: picture },
    },
  } = await axios.get(configKakao.profileUrl, {
    headers,
  });
  const snsId = id;

  const exUser = await User.findOne({ snsId, provider: "kakao" });

  let userId;

  if (exUser) {
    userId = exUser.id;
  } else {
    const newUser = new User({
      email: "", // 앱 심사 필요
      username: name,
      profilePictureUrl: picture,
      snsId,
      provider: "kakao",
      bucketIds: [],
      unreadGuideIds: new Array(12)
        .fill(0)
        .map((_, i) => "guideId" + (i + 1).toString()),
    });
    await newUser.save();
    userId = newUser.id;
  }

  const token = jwt.sign({ userId }, configJwtToken.tokenSecret, {
    expiresIn: configJwtToken.tokenExpiration,
  });

  res.cookie("token", token, {
    maxAge: configJwtToken.tokenExpiration * 1000,
    httpOnly: false,
    secure: true,
    sameSite: "none",
  });
  return res.status(201).json({ loggedIn: true });
};

export default {
  getOauthUrlKakao: errorWrapper(getOauthUrlKakao),
  getAccessTokenKakao: errorWrapper(getAccessTokenKakao),
  loginUsingKakaoOauth: errorWrapper(loginUsingKakaoOauth),
};
