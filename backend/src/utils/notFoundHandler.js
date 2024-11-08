import ApiError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";

const notFoundHandler = (req, res, next) => {
    const error = new ApiError("Route not found", StatusCodes.NOT_FOUND);
    next(error);
}

export default notFoundHandler;