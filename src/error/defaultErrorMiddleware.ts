// 어플리케이션 내 모든 에러들을 중앙 처리하는 기본 에러 처리 미들웨어.

import { Request, Response, NextFunction } from "express";
import { HttpError } from "./HttpError";

export const defaultErrorMiddleware = (
  error: HttpError,
  _1: Request,
  res: Response,
  _2: NextFunction
) => {
  console.error(error);
  console.error(error.message);
  const status = error.status || 500;
  const errorResponse = error.errorResponse || {
    message: error.message || "Some error which has no error message occurred",
  };

  res.status(status).json(errorResponse);
};
