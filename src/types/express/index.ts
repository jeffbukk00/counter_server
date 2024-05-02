import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";

export interface Request extends ExpressRequest {
  accessToken?: string;
  userId?: string;
}

export interface Response extends ExpressResponse {}

export interface NextFunction extends ExpressNextFunction {}
