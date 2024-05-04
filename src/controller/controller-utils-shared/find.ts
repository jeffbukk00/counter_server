import User from "@/model/user";
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import { HttpError } from "@/error/HttpError";

export const findUser = async (userId: string | undefined) => {
  // 요청한 유저의 user id에 해당 되는 유저를 데이터베이스로부터 가져옴.
  const user = await User.findOne({ _id: userId });
  // 요청한 유저의 user id에 해당 되는 유저가 데이터베이스 내 존재하지 않는다면, 404 에러를 throw.
  if (!user) throw new HttpError(404, { message: "User not found" });

  return user;
};

export const findBucket = async (bucketId: string | undefined) => {
  const bucket = await Bucket.findOne({ _id: bucketId });
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  return bucket;
};

export const findCounter = async (counterId: string | undefined) => {
  const counter = await Counter.findOne({ _id: counterId });
  if (!counter) throw new HttpError(404, { message: "Counter not found" });

  return counter;
};
