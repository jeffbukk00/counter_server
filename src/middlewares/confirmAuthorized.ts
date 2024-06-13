/* 
  접근이 제한 된 라우터들에 대한 유저의 권한을 확인하는 미들웨어.
*/

import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "@/types/express";
import { configJwtToken } from "@/config/authConfig/token";
import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";

const confirmAuthorized = (req: Request, _: Response, next: NextFunction) => {
  const authorization = req.get("Authorization");

  if (!authorization) throw new HttpError(400, { loggedIn: false });

  const token = authorization.split(" ")[1];

  if (!token) throw new HttpError(400, { loggedIn: false });

  const { userId }: any = jwt.verify(token, configJwtToken.tokenSecret);

  // 요청한 유저가 보호된 라우터들에 대한 접근 권한을 가지고 있음을 확인하고, 해당 유저를 식별할 수 있는 id를 request 객체에 저장하여 다음 미들웨어로 보냄.
  req.userId = userId;
  return next();
};

export default errorWrapper(confirmAuthorized);
