// 접근 권한을 확인하는 인증 토큰으로 사용할 라이브러리.
import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "@/types/express";

import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import { configJwtToken } from "@/config/authConfig/token";

// 접근 권한을 확인하는 미들웨어.
const confirmAuthorized = (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies.token;

  // 요청 쿠키 내 jwt 토큰이 존재하는지 확인.
  if (!token) throw new HttpError(401, { message: "Request has no token" });

  const { userId }: any = jwt.verify(token, configJwtToken.tokenSecret);

  // 요청한 유저가 보호된 라우터들에 대한 접근 권한을 가지고 있음을 확인하고, 해당 유저를 식별할 수 있는 id를 다음 미들웨어로 보냄.
  req.userId = userId;
  return next();
};

export default errorWrapper(confirmAuthorized);
