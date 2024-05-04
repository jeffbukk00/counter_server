// express 라이브러리 내 기본적으로 존재하는 Request, Response, NextFunction 타입을 확장.
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
