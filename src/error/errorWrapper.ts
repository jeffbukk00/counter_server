/* 
  인자로 전달 받은 콜백 함수 호출 시, throw 되는 에러를 catch해서 defaultErrorMiddleware로 보내는 wrapper.
*/
import { Request, Response, NextFunction } from "express";

export const errorWrapper = (cb: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req, res, next);
    } catch (error: unknown) {
      if (error instanceof Error) return next(error);
    }
  };
};
