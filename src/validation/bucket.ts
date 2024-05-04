// 유효성 검사를 위한 라이브러리.
import Joi from "joi";

// 버킷 생성 및 편집 시 전달되는 데이터 타입
interface BucketInputType {
  title: string;
}

// 버킷 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정
//  1. "title" 필드 => 타입 string / 15자 이하 / 필수 입력
const schema = Joi.object({
  title: Joi.string().max(15).required(),
});

// 버킷 생성 및 편집에 대한 유효성 검사를 실행하는 함수
export const bucketValidation = (bucketData: BucketInputType) =>
  schema.validate(bucketData);
