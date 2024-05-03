import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_TEST_URL!;
console.log(MONGO_CONNECTION_URL);
mongoose
  .connect(MONGO_CONNECTION_URL)
  .then(() => console.log("Mongo connection is opened"))
  .catch((error) => {
    console.log("Mongo connection is failed");
    console.log(error);
  });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

const corsConfig = {
  origin: process.env.CLIENT_HOST,
  credentials: true,
};
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

import confirmAuthorized from "@/middlewares/confirmAuthorized";

app.use(
  "/auth",
  authMainRouter,
  googleOauthRouter,
  kakaoOauthRouter,
  naverOauthRouter
);
// 권한 확인
app.use("/", confirmAuthorized);

app.use("/user", userRouter);
app.use("/buckets", bucketsRouter);
app.use("/bucket", bucketRouter);
app.use("/counters", countersRouter);
app.use("/counter", counterRouter);
app.use("/motivation-texts", motivationTextsRouter);
app.use("/motivation-text", motivationTextRouter);
app.use("/motivation-links", motivationLinksRouter);
app.use("/motivation-link", motivationLinkRouter);
app.use("/sharing", shareLinkRouter);

import { errorWrapper } from "./error/errorWrapper";
import { HttpError } from "./error/HttpError";
app.use(
  "/",
  errorWrapper(() => {
    throw new HttpError(404, { message: "Requested path was not found" });
  })
);

import { defaultErrorMiddleware } from "./error/defaultErrorMiddleware";
app.use(defaultErrorMiddleware);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
