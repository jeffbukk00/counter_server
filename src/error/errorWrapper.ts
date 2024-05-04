// 어플리케이션 내에서 사용 되는 모든 미들웨어들에 대한 에러 처리를 위한 wrapper.

import { Request, Response, NextFunction } from "express";

/**
 * 감싼 미들웨어에서 throw된 에러들을 catch하여, 중앙 에러 처리 경로로 보낸다.
 * @param cb : 어플리케이션 내에서 사용되는 모든 미들웨어들.
 * @returns : cb에서 throw되는 에러들을 처리하는 역할을 하는 wrapper로 감싼 뒤 반환.
 */
export const errorWrapper = (cb: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) return next(error);
    }
  };
};
