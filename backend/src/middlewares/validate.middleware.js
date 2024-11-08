import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const validate = (schema, key) => (req, res, next) => {
    try {
        const data = req[key];
        const { error } = schema.validate(data);
    
        if(error) {
            throw new ApiError(error.details[0].message, StatusCodes.BAD_REQUEST);
        }

        next();
        
    } catch (error) {
        next(error);
    }
}

export default validate;