import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../services/authentication.services.js";
import { findUserById } from "../services/user.services.js";
import { JWT_SECRET } from "../../config.js";

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            throw new ApiError("Invalid token", StatusCodes.UNAUTHORIZED);
        }

        const { id } = verifyToken(token.slice(7), JWT_SECRET);

        const user = await findUserById(id);

        if (!user) {
            throw new ApiError("user not found", StatusCodes.NOT_FOUND);
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

export default authenticate;
