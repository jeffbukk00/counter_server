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
