import Joi from "joi";

interface BucketDataType {
  title: string;
}

const schema = Joi.object({
  title: Joi.string().max(15).required(),
});

export const bucketValidation = (bucketData: BucketDataType) =>
  schema.validate(bucketData);
