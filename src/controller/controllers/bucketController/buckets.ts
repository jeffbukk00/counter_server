import User from "@/model/user";
import Bucket from "@/model/bucket";
import Counter from "@/model/counter";

import {
  findUser,
  findBucket,
} from "@/controller/controller-utils-shared/find";
import { removeBucketUtil } from "@/controller/controller-utils-shared/remove";
import { duplicateBucketUtil } from "@/controller/controller-utils-shared/duplicate";

import { bucketValidation } from "@/validation/bucket";
import { Request, Response, NextFunction } from "@/types/express";
import { errorWrapper } from "@/error/errorWrapper";
import { HttpError } from "@/error/HttpError";

// 유저가 참조하는 모든 bucket들의 데이터를 가져오는 컨트롤러.
const getBuckets = async (req: Request, res: Response, _: NextFunction) => {
  // request 객체에 요청한 유저의 id 저장됨.
  const { userId } = req;

  // 요청한 유저를 DB로부터 쿼리.
  // 동시에, 유저가 참조하는 모든 bucket의 id에 대해 populate(join).
  const user = await User.findOne({ _id: userId }).populate("bucketIds");

  // 존재하지 않는 유저일 경우에 대한 에러 처리.
  if (!user) throw new HttpError(404, { message: "User not found" });

  res.status(200).json({ buckets: user.bucketIds });
};

// 유저가 참조하는 모든 bucket들의 id를 가져오는 컨트롤러.
const getBucketIds = async (req: Request, res: Response, _: NextFunction) => {
  // request 객체에 요청한 유저의 id 저장됨.
  const { userId } = req;

  // 요청한 유저를 DB로부터 쿼리.
  const user = await findUser(userId);

  res.status(200).json({ bucketIds: user.bucketIds });
};

// bucket의 위치를 바꾸는 요청에 대한 컨트롤러.
// 여기서 말하는 위치란, 클라이언트 화면 상에 보여지는 bucket의 순서를 의미.
const changeBucketPosition = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // request 객체에 유저의 id 저장됨.
  const { userId } = req;

  // 요청의 body에 순서가 바뀐 bucket id들의 배열이 저장됨.
  const { bucketIds } = req.body;

  // 요청한 유저를 DB로부터 쿼리.
  const user = await findUser(userId);

  // 유저가 참조하는 bucket id들의 배열 업데이트.
  user.bucketIds = bucketIds;

  // DB에 저장.
  await user.save();

  return res
    .status(201)
    .json({ message: "Change bucket's position successfully" });
};

// bucket를 생성하는 컨트롤러.
const createBucket = async (req: Request, res: Response, _: NextFunction) => {
  // request 객체에 유저의 id 저장됨.
  const { userId } = req;

  // 요청한 유저를 DB로부터 쿼리.
  const user = await findUser(userId);

  // 요청의 body에 새롭게 생성할 bucket의 데이터가 저장됨.
  const { data } = req.body;

  // 새롭게 생성할 bucket의 데이터에 대한 유효성 검사.
  const { error } = bucketValidation(data);

  // 새롭게 생성할 bucket의 데이터에 대한  유효성 검사가 실패하는 경우에 대한 에러 처리.
  if (error) throw new HttpError(400, { message: error.details[0].message });

  const { title } = data;

  // 새로운 bucket 생성.
  const newBucket = new Bucket({
    title,
    counterIds: [],
    motivationTextIds: [],
    motivationLinkIds: [],
  });

  // bucket 생성을 요청한 유저에게 생성 된 bucket에 대한 참조 추가.
  user.bucketIds.push(newBucket._id);

  // DB에 저장.
  await newBucket.save();
  await user.save();

  res.status(201).json({ message: "Create bucket successfully" });
};

// bucket을 복제하는 컨트롤러.
const duplicateBucket = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // request 객체에 유저의 id 저장됨.
  const { userId } = req;

  // DB로부터 유저를 쿼리.
  const user = await findUser(userId);

  // 복제를 요청한 bucket의 id가 요청 패러미터에 저장.
  const { bucketId } = req.params;

  // 복제를 요청한 bucket을 DB로부터 쿼리.
  // 해당 bucket이 참조하고 있는 모든 counter들과 모든 motivation들을 populate(join).
  const bucket: any = await Bucket.findOne({ _id: bucketId }).populate(
    "counterIds motivationTextIds motivationLinkIds"
  );

  // 존재하지 않는 bucket일 경우에 대한 에러 처리.
  if (!bucket) throw new HttpError(404, { message: "Bucket not found" });

  // 복제할 bucket의 데이터 정리.
  // bucket의 title과 모든 motivation들.
  const bucketData = {
    title: bucket?.title,
    motivationTexts: bucket._doc.motivationTextIds,
    motivationLinks: bucket._doc.motivationLinkIds,
  };

  // 복제할 bucket의 데이터 정리.
  // bucket이 참조하는 counter들이 참조하고 있는 모든 motivation들을 populate(join).
  // bucket과 counter는 둘 다 각각 motivation들에 대한 참조를 가질 수 있다.
  const counters: any = await Counter.populate(
    bucket.counterIds,
    "motivationTextIds motivationLinkIds"
  );

  // 복제할 bucket의 데이터 정리.
  // bucket이 참조하는 counter 복제 시, counter의 데이터 초기화해서 정리.
  const countersData = counters.map((e: any) => {
    return {
      title: e.title,
      startCount: e.startCount,
      endCount: e.endCount,
      direction: e.direction,
      motivationTexts: e._doc.motivationTextIds,
      motivationLinks: e._doc.motivationLinkIds,
    };
  });

  let updatedBucketIds = [...user.bucketIds];

  // 복제하는 bucket의 인덱스 찾기.
  const idx = updatedBucketIds.findIndex((e) => e.toString() === bucketId);

  // 복제하는 bucket의 인덱스를 찾을 수 없는 경우에 대한 에러 처리.
  if (idx === -1)
    throw new HttpError(500, { message: "Invalid data in bucketIds property" });

  // 정리한 bucket의 데이터를 바탕으로 DB에 복제하는 유틸 함수 호출.
  // 복제된 bucket의 id 반환.
  const duplicatedBucketId = await duplicateBucketUtil(
    bucketData,
    countersData
  );

  // 복제된 bucket을 원본 bucket의 바로 옆에 삽입.
  const slicedBeforeIdx = updatedBucketIds.slice(0, idx + 1);
  const slicedAfterIdx = updatedBucketIds.slice(idx + 1);
  slicedBeforeIdx.push(duplicatedBucketId);
  updatedBucketIds = [...slicedBeforeIdx, ...slicedAfterIdx];
  user.bucketIds = updatedBucketIds;

  // DB에 저장.
  await user.save();

  return res.status(201).json({ message: "Duplicate bucket successfully" });
};

// bucket들을 병합하는 컨트롤러.
const mergeBuckets = async (req: Request, res: Response, _: NextFunction) => {
  // request 객체에 유저의 id 저장됨.
  const { userId } = req;

  // DB로부터 유저를 쿼리.
  const user = await findUser(userId);

  // 병합의 주체가 되는 bucket의 id가 요청 패러미터에 저장.
  const { bucketIdSubject } = req.params;
  // 병합의 대상이 되는 bucket의 id가 요청의 body에 저장.
  const { bucketIdObject } = req.body;

  // 병합의 주체가 되는 bucket을 DB로부터 쿼리.
  const bucketSubject = await findBucket(bucketIdSubject);
  // 병합의 대상이 되는 bucket을 DB로부터 쿼리.
  const bucketObject = await findBucket(bucketIdObject);

  // 병합의 주체가 되는 bucket에 병합의 대상이 되는 bucket이 참조하는 모든 counter들에 대한 참조를 저장.
  bucketSubject.counterIds = [...bucketSubject.counterIds].concat([
    ...bucketObject.counterIds,
  ]);

  // 병합의 주체가 되는 bucket에 병합의 대상이 되는 bucket이 참조하는 모든 motivation들에 대한 참조를 저장.
  bucketSubject.motivationTextIds = [...bucketSubject.motivationTextIds].concat(
    [...bucketObject.motivationTextIds]
  );
  bucketSubject.motivationLinkIds = [...bucketSubject.motivationLinkIds].concat(
    [...bucketObject.motivationLinkIds]
  );

  // 요청한 유저가 참조하는 bucket들의 id 배열에서 병합의 대상이 되는 bucket의 id 필터링.
  user.bucketIds = [...user.bucketIds].filter(
    (e) => e.toString() !== bucketIdObject
  );

  // DB에 저장.
  await bucketSubject.save();
  await user.save();

  // 병합의 대상이 되는 bucket을 DB로부터 삭제.
  await Bucket.deleteOne({ _id: bucketIdObject });

  return res.status(201).json({ message: "Merge buckets successfully" });
};

// bucket을 삭제하는 컨트롤러.
const removeBucket = async (req: Request, res: Response, _: NextFunction) => {
  // request 객체에 유저의 id 저장됨.
  const { userId } = req;
  // 요청한 bucket의 id가 요청 패러미터에 저장.
  const { bucketId } = req.params;

  // 요청한 유저를 DB로부터 쿼리.
  const user = await findUser(userId);
  // 삭제할 bucket을 DB로부터 쿼리.
  // bucket이 참조하는 모든 counter들을 populate(join).
  const bucket: any = await Bucket.findOne({ _id: bucketId }).populate(
    "counterIds"
  );

  // bucket과 bucket이 참조하는 데이터들을 DB로부터 삭제하는 역할을 하는 유틸 함수 호출.
  await removeBucketUtil({ ...bucket._doc });

  // 유저가 참조하는 모든 bucket들의 id 배열에서 삭제 된 bucket의 id 필터링.
  user.bucketIds = [...user.bucketIds].filter((e) => e.toString() !== bucketId);

  // DB에 저장.
  await user.save();

  return res.status(201).json({ message: "Remove bucket successfully" });
};

export default {
  getBuckets: errorWrapper(getBuckets),
  getBucketIds: errorWrapper(getBucketIds),
  changeBucketPosition: errorWrapper(changeBucketPosition),
  createBucket: errorWrapper(createBucket),
  duplicateBucket: errorWrapper(duplicateBucket),
  mergeBuckets: errorWrapper(mergeBuckets),
  removeBucket: errorWrapper(removeBucket),
};
