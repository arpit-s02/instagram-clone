import { hashPassword } from "../services/authentication.services.js";
import { createUser, getUserByEmail } from "../services/user.services.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

const signup = async (req, res, next) => {
    try {
        const { body: user } = req;
        const { email, password, confirmPassword } = user;

        if(password !== confirmPassword) {
            throw new ApiError("Password and confirm password do not match", StatusCodes.BAD_REQUEST);
        }

        const existingUser = await getUserByEmail(email);

        if(existingUser) {
            throw new ApiError("A user with this email already exists", StatusCodes.CONFLICT);
        }

        const hashedPassword = await hashPassword(password);
        const newUser = await createUser({ ...user, password: hashedPassword });
        return res
        .status(StatusCodes.CREATED)
        .json({
            message: "User created successfully",
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        next(error);
    }
}

export { signup };

