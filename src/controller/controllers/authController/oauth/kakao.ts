import axios from "axios";
import jwt from "jsonwebtoken";

import User from "@/model/user";

import {
  configKakao,
  authParamsKakao,
  getTokenParamsKakao,
} from "@/config/authConfig/oauth/kakao";
import { configJwtToken } from "@/config/authConfig/token";
import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import { Request, Response, NextFunction } from "@/types/express";

// 플랫폼 로그인 페이지 URL을 요청하는 요청에 대한 컨트롤러.
const getOauthUrlKakao = (_: Request, res: Response) => {
  res.json({
    loginUrl: `${configKakao.authUrl}?${authParamsKakao}`,
  });
};

// 플랫폼 로그인 페이지에서 로그인을 완료한 유저의 정보에 접근할 권한을 부여하는 엑세스 토큰 발급을 위한 컨트롤러.
const getAccessTokenKakao = async (
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

  // 플랫폼의 인증 서버에 엑세스 토큰을 요청하는 요청의 패러미터.
  const tokenParam = getTokenParamsKakao(code);

  // 플랫폼의 인증 서버에 엑세스 토큰을 요청하는 요청의 헤더.
  const headers = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  };

  // 플랫폼의 인증 서버로 보내는 엑세스 토큰 발급 요청.
  const {
    data: { access_token },
  } = await axios.post(`${configKakao.tokenUrl}?${tokenParam}`, { headers });

  // 엑세스 토큰 발급 실패 시, 에러 처리.
  if (!access_token)
    throw new HttpError(400, { message: "Cannot get access token" });

  // request 객체에 발급한 엑세스 토큰 저장.
  req.accessToken = access_token;

  return next();
};

// 발급 받은 엑세스 토큰을 활용하여 플랫폼 인증 서버에 유저 데이터 요청, 이를 활용하여 유저 생성. 그리고 로그인을 위한 jwt 토큰을 발급하는 컨트롤러.
const loginUsingKakaoOauth = async (req: Request, res: Response) => {
  // request 객체에 저장 된 엑세스 토큰.
  const { accessToken } = req;

  // request 객체에 저장 된 엑세스 토큰이 없는 경우에 대한 에러 처리.
  if (!accessToken)
    throw new HttpError(400, { message: "Cannot get access token" });

  // 플랫폼 인증 서버로 유저 데이터를 요청하는 요청의 헤더.
  const headers = {
    Authorization: "Bearer " + accessToken,
    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
  };

  // 플랫폼 인증 서버로 유저 데이터를 요청.
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
    // 이미 존재하는 유저가 로그인 한 경우.
    userId = exUser.id;
  } else {
    // 새로운 유저가 로그인한 경우.
    // 플랫폼 인증 서버로부터 응답 받은 유저 데이터를 활용하여 새로운 유저 생성 및 DB에 저장.
    const newUser = new User({
      // 테스트 어플리케이션 상태에서는 유저 이메일 요청 불가. 비즈니스 어플리케이션으로의 전환 필요. 사전 심사 받아야 함.
      email: "",
      username: name,
      profilePictureUrl: picture,
      snsId,
      provider: "kakao",
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
  getOauthUrlKakao: errorWrapper(getOauthUrlKakao),
  getAccessTokenKakao: errorWrapper(getAccessTokenKakao),
  loginUsingKakaoOauth: errorWrapper(loginUsingKakaoOauth),
};
