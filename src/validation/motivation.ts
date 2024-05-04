// 유효성 검사를 위한 라이브러리.
import Joi from "joi";

// 모티베이션 텍스트 생성 및 편집 시 전달되는 데이터 타입.
interface MotivationTextInputType {
  text: string;
}

// 모티베이션 링크 생성 및 편집 시 전달되는 데이터 타입.
interface MotivationLinkInputType {
  title: string;
  link: string;
}

// 모티베이션 텍스트 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정.
//  1. "text" 필드 => string 타입 / 필수 입력
const motivationTextSchema = Joi.object({
  text: Joi.string().required(),
});

// 모티베이션 링크 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정.
//  1. "title" 필드 => string 타입 / 15자 이하 / 필수 입력
//  2. "link" 필드 => string 타입 / 필수 입력
const motivationLinkSchema = Joi.object({
  title: Joi.string().max(15).required(),
  link: Joi.string().required(),
});

// 모티베이션 텍스트 생성 및 편집에 대한 유효성 검사를 실행하는 함수.
export const motivationTextValidation = (
  motivationTextData: MotivationTextInputType
) => motivationTextSchema.validate(motivationTextData);

// 모티베이션 링크 생성 및 편집에 대한 유효성 검사를 실행하는 함수.
export const motivationLinkValidation = (
  motivationLinkData: MotivationLinkInputType
) => motivationLinkSchema.validate(motivationLinkData);
