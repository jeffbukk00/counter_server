// 라이브러리.
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// 모든 라우터.
import authMainRouter from "@/router/authRouter/authMain";
import googleOauthRouter from "@/router/authRouter/oauthRouter/google";
import kakaoOauthRouter from "@/router/authRouter/oauthRouter/kakao";
import naverOauthRouter from "@/router/authRouter/oauthRouter/naver";
import userRouter from "@/router/userRouter/user";
import bucketsRouter from "@/router/bucketRouter/buckets";
import bucketRouter from "@/router/bucketRouter/bucket";
import countersRouter from "@/router/counterRouter/counters";
import counterRouter from "@/router/counterRouter/counter";
import motivationTextsRouter from "@/router/motivationRouter/motivationsTexts";
import motivationTextRouter from "@/router/motivationRouter/motivationText";
import motivationLinksRouter from "@/router/motivationRouter/motivationLinks";
import motivationLinkRouter from "@/router/motivationRouter/motivationLink";
import shareLinkRouter from "@/router/shareLinkRouter/shareLink";
import historyRouter from "@/router/historyRouter/history";

// 에러 처리 관련.
import { errorWrapper } from "./error/errorWrapper";
import { HttpError } from "./error/HttpError";
import { defaultErrorMiddleware } from "./error/defaultErrorMiddleware";

// 기타.
import { CLIENT_HOST } from "./constants/client";
import confirmAuthorized from "@/middlewares/confirmAuthorized";

// 디렉토리 루트에 존재하는 .env 파일에 대한 설정.
// 프로젝트 내에서 환경변수 사용 가능해짐.
dotenv.config();

// 데이터베이스 연결
// ODM으로 mongoose 사용
import { MONGO_CONNECTION_URL } from "./constants/db";

mongoose
  .connect(MONGO_CONNECTION_URL!)
  .then(() => console.log("Mongo connection is opened"))
  .catch((error) => {
    console.log("Mongo connection is failed");
    console.log(error);
  });

// 서버 어플리케이션 초기화
const app = express();

// 모든 미들웨어들에 대한 기본 설정들.
const corsConfig = {
  origin: CLIENT_HOST,
  credentials: true,
};
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 유저 인증에 대한 라우터
app.use(
  "/auth",
  authMainRouter,
  googleOauthRouter,
  kakaoOauthRouter,
  naverOauthRouter
);

// 아래의 라우터들에 대한 접근 권한을 확인하는 미들웨어.
app.use("/", confirmAuthorized);

// 유저에 대한 라우터.
app.use("/user", userRouter);

// 버킷에 대한 라우터들.
app.use("/buckets", bucketsRouter);
app.use("/bucket", bucketRouter);

// 카운터에 대한 라우터들.
app.use("/counters", countersRouter);
app.use("/counter", counterRouter);

// 모티베이션에 대한 라우터들.
app.use("/motivation-texts", motivationTextsRouter);
app.use("/motivation-text", motivationTextRouter);
app.use("/motivation-links", motivationLinksRouter);
app.use("/motivation-link", motivationLinkRouter);

// 공유 링크에 대한 라우터.
app.use("/sharing", shareLinkRouter);

// 히스토리에 대한 라우터.
app.use("/history", historyRouter);

// 404(not-found) 에러에 대한 에러 처리 경로.
app.use(
  "/",
  errorWrapper(() => {
    throw new HttpError(404, { message: "Requested path was not found" });
  })
);

// 어플리케이션 내 모든 에러들을 중앙 처리하는 기본 에러 처리 경로.
app.use(defaultErrorMiddleware);

// 서버 실행.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
