import Joi from "joi";
import { followStatus } from "../utils/followStatusTypes.js";

const validStatuses = Object.values(followStatus);

const followRequestStatusSchema = Joi.object().keys({
    status: Joi.string()
        .valid(...validStatuses)
        .required(),
});

export default followRequestStatusSchema;
