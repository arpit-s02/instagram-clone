import Joi from "joi";

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const commentSchema = Joi.object().keys({
  content: Joi.string().max(2200).required(),
  parentId: Joi.string()
    .regex(mongoIdPattern)
    .message("parent id must be a valid mongo id"),
});

export default commentSchema;
