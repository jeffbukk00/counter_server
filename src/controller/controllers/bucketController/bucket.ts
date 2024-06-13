import { findBucket } from "@/controller/controller-utils-shared/find";

import { bucketValidation } from "@/validation/bucket";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// bucket 하나의 데이터를 가져오는 컨트롤러.
const getBucket = async (req: Request, res: Response, _: NextFunction) => {
  // 데이터를 요청하는 bucket의 id를 요청 패러미터에 저장.
  const { bucketId } = req.params;

  // 요청된 bucket을 DB에서 가져옴.
  const bucket = await findBucket(bucketId);

  res.status(200).json({ bucket });
};

// bucket을 수정하는 컨트롤러.
const editBucket = async (req: Request, res: Response, _: NextFunction) => {
  // 수정을 요청하는 bucket의 id를 요청 패러미터에 저장.
  const { bucketId } = req.params;

  // 수정할 bucket을 DB에서 가져옴.
  const bucket = await findBucket(bucketId);

  // 요청의 body에 저장 된 bucket 수정 데이터에 대한 유효성 검사.
  const { error } = bucketValidation(req.body);

  // bucket 수정 데이터에 대한 유효성 검사를 통과하지 못한 경우에 대한 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  // bucket 수정.
  const { title } = req.body;
  bucket.title = title;

  // DB에 저장.
  await bucket.save();

  return res.status(201).json({ message: "Edit bucket successfully" });
};

export default {
  getBucket: errorWrapper(getBucket),
  editBucket: errorWrapper(editBucket),
};
