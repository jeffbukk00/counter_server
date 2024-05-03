import Joi from "joi";

interface MotivationTextDataType {
  text: string;
}

interface MotivationLinkDataType {
  title: string;
  link: string;
}

const motivationTextSchema = Joi.object({
  text: Joi.string().required(),
});

const motivationLinkSchema = Joi.object({
  title: Joi.string().max(15).required(),
  link: Joi.string().required(),
});

export const motivationTextValidation = (
  motivationTextData: MotivationTextDataType
) => motivationTextSchema.validate(motivationTextData);

export const motivationLinkValidation = (
  motivationLinkData: MotivationLinkDataType
) => motivationLinkSchema.validate(motivationLinkData);
