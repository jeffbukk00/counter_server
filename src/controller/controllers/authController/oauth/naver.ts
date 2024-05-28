import axios from "axios";
import jwt from "jsonwebtoken";

import User from "@/model/user";

import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import {
  configNaver,
  authParamsNaver,
  getTokenParamsNaver,
} from "@/config/authConfig/oauth/naver";
import { Request, Response, NextFunction } from "@/types/express";
import { configJwtToken } from "@/config/authConfig/token";

const getOauthUrlNaver = (_: Request, res: Response) => {
  res.json({
    loginUrl: `${configNaver.authUrl}?${authParamsNaver}`,
  });
};

const getAccessTokenNaver = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code, state } = req.query;
  if (!code)
    throw new HttpError(400, {
      message: "Authorization code must be provided",
    });

  const tokenParam = getTokenParamsNaver(code, state);

  const {
    data: { access_token },
  } = await axios.post(`${configNaver.tokenUrl}?${tokenParam}`);

  if (!access_token)
    throw new HttpError(400, { message: "Cannot get access token" });

  req.accessToken = access_token;
  return next();
};

const loginUsingNaverOauth = async (req: Request, res: Response) => {
  const { accessToken } = req;

  if (!accessToken)
    throw new HttpError(400, { message: "Cannot get access token" });

  const headers = { Authorization: "Bearer " + accessToken };

  const {
    data: {
      response: { id, email, nickname: name, profile_image: picture },
    },
  } = await axios.get(configNaver.profileUrl, {
    headers,
  });
  const snsId = id;

  const exUser = await User.findOne({ snsId, provider: "naver" });

  let userId;

  if (exUser) {
    userId = exUser.id;
  } else {
    const newUser = new User({
      email,
      username: name,
      profilePictureUrl: picture,
      snsId,
      provider: "naver",
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
  getOauthUrlNaver: errorWrapper(getOauthUrlNaver),
  getAccessTokenNaver: errorWrapper(getAccessTokenNaver),
  loginUsingNaverOauth: errorWrapper(loginUsingNaverOauth),
};
