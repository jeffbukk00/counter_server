import Joi from "joi";
import counterConstants from "@/constants/counter";

interface CounterDataType {
  title: string;
  startCount: number;
  endCount: number;
}

const schema = Joi.object({
  title: Joi.string().max(15).required(),
  startCount: Joi.number().min(0).max(999999).required(),
  endCount: Joi.number()
    .min(0)
    .max(999999)
    .disallow(Joi.ref("startCount"))
    .required(),
});

export const counterValidation = (counterData: CounterDataType) =>
  schema.validate(counterData);

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
