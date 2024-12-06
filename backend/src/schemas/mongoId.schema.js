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

export default mongoIdSchema;
