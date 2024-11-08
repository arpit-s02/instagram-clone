import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

const verifyPassword = async (password, hashedPassword) => {
    const isPasswordvalid = await bcrypt.compare(password, hashedPassword);
    return isPasswordvalid;
}

const generateToken = (payload, secret) => {
    const token = jwt.sign(payload, secret);
    return token;
}

const verifyToken = (token, secret) => {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;

    } catch (error) {
        throw new ApiError("Invalid token", StatusCodes.UNAUTHORIZED);
    }
}

export { hashPassword, generateToken, verifyToken, verifyPassword };