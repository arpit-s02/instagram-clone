import Joi from "joi";

const validateMongoId = (value, helpers) => {
  const pattern = /^[0-9a-fA-F]{24}$/;

  if (!pattern.test(value)) {
    return helpers.message("id should be a valid mongo id");
  }

  return value;
};

const mongoIdSchema = Joi.object().keys({
  id: Joi.string().custom(validateMongoId).required(),
});

const mongoIdPattern = /^[0-9a-fA-F]{24}$/;

const getMongoIdSchema = (property, required = true) => {
  return required
    ? Joi.object().keys({
        [property]: Joi.string()
          .regex(mongoIdPattern)
          .message(`${property} must be a valid mongo id`)
          .required(),
      })
    : Joi.object().keys({
        [property]: Joi.string()
          .regex(mongoIdPattern)
          .message(`${property} must be a valid mongo id`)
          .optional(),
      });
};

export default mongoIdSchema;
export { getMongoIdSchema };
