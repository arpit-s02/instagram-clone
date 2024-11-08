import Joi from "joi";

const validatePassword = (value, helpers) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const isPasswordValid = regex.test(value);

    if(!isPasswordValid) {
        return helpers.message("Password must be 8 characters long and must have atleast one lowercase letter, one uppercase letter, one numeric and one special character");
    }

    return value;
}

const registerSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().custom(validatePassword).required(),
    confirmPassword: Joi.string().required(),
    profilePicture: Joi.string().uri(),
    bio: Joi.string()
});

export default registerSchema;