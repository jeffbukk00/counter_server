/*
  서로 다른 라우터에 속한 컨트롤러들이 공유하는 유틸 함수들.

  DB로부터의 쿼리 관련.
*/

import User from "@/model/user";
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { HttpError } from "@/error/HttpError";

// user 쿼리.
export const findUser = async (userId: string | undefined) => {
  // DB로부터 user 쿼리.
  const user = await User.findOne({ _id: userId });

  // 존재하지 않는 user에 대한 에러 처리.
  if (!user) throw new HttpError(404, { message: "User not found" });

  return user;
};

// bucket 쿼리.
export const findBucket = async (bucketId: string | undefined) => {
  // DB로부터 bucket 쿼리.
  const bucket = await Bucket.findOne({ _id: bucketId });

  // 존재하지 않는 bucket에 대한 에러 처리.
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  return bucket;
};

// counter 쿼리.
export const findCounter = async (counterId: string | undefined) => {
  // DB로부터 counter 쿼리.
  const counter = await Counter.findOne({ _id: counterId });

  // 존재하지 않는 counter에 대한 에러 처리.
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  return counter;
};
