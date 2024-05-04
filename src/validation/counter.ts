// 유효성 검사를 위한 라이브러리.
import Joi from "joi";
// 카운터와 관련된 상수들.
import counterConstants from "@/constants/counter";

// 버킷 생성 및 편집 시 전달되는 데이터 타입.
interface CounterInputType {
  title: string;
  startCount: number;
  endCount: number;
}

// 버킷 생성 및 편집에 대한 유효성 검사를 위한 스키마 설정.
//  1. "title" 필드 => 타입 string / 15자 이하 / 필수 입력
//  2. "startCount" 필드 => 타입 number / 최소 0 / 최대 999,999 / 필수 입력
//  3. "endCount" 필드 => 타입 number /  최소 0 / 최대 999,9999 / "startCount" 필드와 값이 같이 않아야 함. / 필수 입력
const schema = Joi.object({
  title: Joi.string().max(15).required(),
  startCount: Joi.number().min(0).max(999999).required(),
  endCount: Joi.number()
    .min(0)
    .max(999999)
    .disallow(Joi.ref("startCount"))
    .required(),
});

// 버킷 생성 및 편집에 대한 유효성 검사를 실행하는 함수.
export const counterValidation = (counterData: CounterInputType) =>
  schema.validate(counterData);

// 카운터 업데이트 시, 변경 된 "startCount" 필드의 값과 "endCount" 필드의 값 사이에 기존 "currentCurrent" 필드의 값이 존재하는지에 대한 유효성 검사를 실행하는 함수.
export const counterEditValidation = (
  direction: number | null | undefined,
  startCount: number | null | undefined,
  currentCount: number | null | undefined,
  endCount: number | null | undefined
) => {
  if (
    typeof direction !== "number" ||
    typeof startCount !== "number" ||
    typeof currentCount !== "number" ||
    typeof endCount !== "number"
  )
    return null;
  if (direction === counterConstants.direction.up) {
    return currentCount >= startCount && currentCount <= endCount;
  } else {
    return currentCount <= startCount && currentCount >= endCount;
  }
};

// 카운터의 카운트("currentCount" 필드) 업데이트 시, 변경 된 "currentCount" 필드의 값이 기존 "startCount" 필드의 값과 "endCount" 필드의 값 사이에 존재하는지에 대한 유효성 검사를 실행하는 함수.
export const countUpdateValidation = (
  direction: number | null | undefined,
  startCount: number | null | undefined,
  updatedCurrentCount: number | null | undefined,
  endCount: number | null | undefined
) => {
  if (
    typeof direction !== "number" ||
    typeof startCount !== "number" ||
    typeof updatedCurrentCount !== "number" ||
    typeof endCount !== "number"
  )
    return null;
  if (direction === counterConstants.direction.up) {
    return updatedCurrentCount >= startCount && updatedCurrentCount <= endCount;
  } else {
    return updatedCurrentCount <= startCount && updatedCurrentCount >= endCount;
  }
};
