import jwt from "jsonwebtoken";

import { Request, Response, NextFunction } from "@/types/express";

import { HttpError } from "@/error/HttpError";
import { errorWrapper } from "@/error/errorWrapper";
import { configJwtToken } from "@/config/authConfig/token";

const confirmAuthorized = (req: Request, _: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) throw new HttpError(401, { message: "Request has no token" });
  const { userId }: any = jwt.verify(token, configJwtToken.tokenSecret);
  req.userId = userId;
  return next();
};

export default errorWrapper(confirmAuthorized);
