import axios from "axios";
import jwt from "jsonwebtoken";

import User from "@/model/user";

import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import {
  configGoogle,
  authParamsGoogle,
  getTokenParamsGoogle,
} from "@/config/authConfig/oauth/google";
import { Request, Response, NextFunction } from "@/types/express";
import { configJwtToken } from "@/config/authConfig/token";

const getOauthUrlGoogle = (_: Request, res: Response) => {
  res.json({
    loginUrl: `${configGoogle.authUrl}?${authParamsGoogle}`,
  });
};

const getAccessTokenGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.query;
  if (!code)
    throw new HttpError(400, {
      message: "Authorization code must be provided",
    });

  const tokenParam = getTokenParamsGoogle(code);

  const {
    data: { access_token },
  } = await axios.post(`${configGoogle.tokenUrl}?${tokenParam}`);

  if (!access_token)
    throw new HttpError(400, { message: "Cannot get access token" });

  req.accessToken = access_token;
  return next();
};

const loginUsingGoogleOauth = async (req: Request, res: Response) => {
  const { accessToken } = req;

  if (!accessToken)
    throw new HttpError(400, { message: "Cannot get access token" });

  const headers = { Authorization: "Bearer " + accessToken };

  const {
    data: { id, email, name, picture },
  } = await axios.get(configGoogle.profileUrl, {
    headers,
  });
  const snsId = id;

  const exUser = await User.findOne({ snsId, provider: "google" });

  let userId;

  if (exUser) {
    userId = exUser.id;
  } else {
    const newUser = new User({
      email,
      username: name,
      profilePictureUrl: picture,
      snsId,
      provider: "google",
      // bucketIds
      // unreadPositivePopupIds
    });
    await newUser.save();
    userId = newUser.id;
  }

  const token = jwt.sign({ userId }, configJwtToken.tokenSecret, {
    expiresIn: configJwtToken.tokenExpiration,
  });

  res.cookie("token", token, {
    maxAge: configJwtToken.tokenExpiration * 1000,
    httpOnly: true,
  });
  return res.status(201).json({ loggedIn: true });
};

export default {
  getOauthUrlGoogle: errorWrapper(getOauthUrlGoogle),
  getAccessTokenGoogle: errorWrapper(getAccessTokenGoogle),
  loginUsingGoogleOauth: errorWrapper(loginUsingGoogleOauth),
};
