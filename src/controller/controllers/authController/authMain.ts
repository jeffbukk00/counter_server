import jwt from "jsonwebtoken";

import { Request, Response } from "@/types/express";
import { configJwtToken } from "@/config/authConfig/token";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// 유저의 로그인 여부를 확인하는 컨트롤러.
export const checkLoggedIn = (req: Request, res: Response) => {
  try {
    // 요청의 Authorization 헤더 확인.
    const authorization = req.get("Authorization");

    // Authorization 헤더에 할당된 값이 없는 경우에 대한 에러 처리.
    if (!authorization) throw new HttpError(400, { loggedIn: false });

    // Authorization 헤더에 토큰이 할당 되어 있는지 확인.
    const token = authorization.split(" ")[1];

    // Authorization 헤더에 토큰이 할당 되어 있지 않은 경우에 대한 에러 처리.
    if (!token) throw new HttpError(400, { loggedIn: false });

    // 토큰 유효성 검사.
    jwt.verify(token, configJwtToken.tokenSecret) as any;

    return res.status(200).json({ loggedIn: true });
  } catch (err) {
    console.log(err);
    throw new HttpError(400, { loggedIn: false });
  }
};

// 로그아웃에 대한 컨트롤러.
export const logout = (req: Request, res: Response) => {
  // 업데이트 이전 로그인 방식에서는 쿠키 사용.
  // 업데이트 이후, 클라이언트 사이드의 로컬 스토리지를 활용. 클라이언트 사이드와 서버 사이드 간의 분리.
  // res
  //   .clearCookie("token", { httpOnly: false, secure: true, sameSite: "none" })
  //   .status(201)
  //   .json({ message: "Logged out" });

  res.status(201).json({ message: "Logged out" });
};

export default {
  checkLoggedIn: errorWrapper(checkLoggedIn),
  logout: errorWrapper(logout),
};
