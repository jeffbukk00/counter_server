import { Request, Response, NextFunction } from "express";
import { HttpError } from "./HttpError";

export const defaultErrorMiddleware = (
  error: HttpError,
  _1: Request,
  res: Response,
  _2: NextFunction
) => {
  console.error(error);
  const status = error.status || 500;
  const errorResponse = error.errorResponse || {
    message: error.message || "Some error which has no error message occurred",
  };

  res.status(status).json(errorResponse);
};
