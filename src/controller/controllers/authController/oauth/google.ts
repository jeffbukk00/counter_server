import axios from "axios";
import jwt from "jsonwebtoken";

import User from "@/model/user";

import {
  configGoogle,
  authParamsGoogle,
  getTokenParamsGoogle,
} from "@/config/authConfig/oauth/google";
import { configJwtToken } from "@/config/authConfig/token";
import { Request, Response, NextFunction } from "@/types/express";
import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";

// 플랫폼 로그인 페이지 URL을 요청하는 요청에 대한 컨트롤러.
const getOauthUrlGoogle = (_: Request, res: Response) => {
  res.json({
    loginUrl: `${configGoogle.authUrl}?${authParamsGoogle}`,
  });
};

// 플랫폼 로그인 페이지에서 로그인을 완료한 유저의 정보에 접근할 권한을 부여하는 엑세스 토큰 발급을 위한 컨트롤러.
const getAccessTokenGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 요청 패러미터에 저장 된 권한 토큰.
  // 엑세스 토큰 발급 시 사용 됨.
  const { code } = req.query;

  // 저장된 권한 토큰이 없는 경우에 대한 에러 처리.
  if (!code)
    throw new HttpError(400, {
      message: "Authorization code must be provided",
    });

  // 플랫폼의 인증 서버로 향할 엑세스 토큰 발급 요청의 요청 패러미터.
  const tokenParam = getTokenParamsGoogle(code);

  // 플랫폼의 인증 서버로 보내는 엑세스 토큰 발급 요청.
  const {
    data: { access_token },
  } = await axios.post(`${configGoogle.tokenUrl}?${tokenParam}`);

  // 엑세스 토큰 발급 실패 시, 에러 처리.
  if (!access_token)
    throw new HttpError(400, { message: "Cannot get access token" });

  // request 객체에 발급한 엑세스 토큰 저장.
  req.accessToken = access_token;

  return next();
};

// 발급 받은 엑세스 토큰을 활용하여 플랫폼 인증 서버에 유저 데이터 요청, 이를 활용하여 유저 생성. 그리고 로그인을 위한 jwt 토큰을 발급하는 컨트롤러.
const loginUsingGoogleOauth = async (req: Request, res: Response) => {
  // request 객체에 저장 된 엑세스 토큰.
  const { accessToken } = req;

  // request 객체에 저장 된 엑세스 토큰이 없는 경우에 대한 에러 처리.
  if (!accessToken)
    throw new HttpError(400, { message: "Cannot get access token" });

  // 플랫폼 인증 서버로 유저 데이터를 요청하는 요청의 헤더.
  const headers = { Authorization: "Bearer " + accessToken };

  // 플랫폼 인증 서버로 유저 데이터를 요청.
  const {
    data: { id, email, name, picture },
  } = await axios.get(configGoogle.profileUrl, {
    headers,
  });

  const snsId = id;

  const exUser = await User.findOne({ snsId, provider: "google" });

  let userId;

  if (exUser) {
    // 이미 존재하는 유저가 로그인 한 경우.
    userId = exUser.id;
  } else {
    // 새로운 유저가 로그인한 경우.
    // 플랫폼 인증 서버로부터 응답 받은 유저 데이터를 활용하여 새로운 유저 생성 및 DB에 저장.
    const newUser = new User({
      email,
      username: name,
      profilePictureUrl: picture,
      snsId,
      provider: "google",
      bucketIds: [],
      unreadGuideIds: new Array(13)
        .fill(0)
        .map((_, i) => "guideId" + (i + 1).toString()),
    });
    await newUser.save();

    userId = newUser.id;
  }

  // 유저에 대한 jwt 토큰 발급.
  const token = jwt.sign({ userId }, configJwtToken.tokenSecret, {
    expiresIn: configJwtToken.tokenExpiration,
  });

  return res.status(201).json({ loggedIn: true, token });
};

export default {
  getOauthUrlGoogle: errorWrapper(getOauthUrlGoogle),
  getAccessTokenGoogle: errorWrapper(getAccessTokenGoogle),
  loginUsingGoogleOauth: errorWrapper(loginUsingGoogleOauth),
};
