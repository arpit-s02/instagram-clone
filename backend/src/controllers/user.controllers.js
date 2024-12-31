import {
  generateToken,
  hashPassword,
  verifyPassword,
} from "../services/authentication.services.js";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "../services/user.services.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { JWT_SECRET } from "../../config.js";

const signup = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new ApiError(
        "Password and confirm password do not match",
        StatusCodes.BAD_REQUEST
      );
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      throw new ApiError(
        "A user with this email already exists",
        StatusCodes.CONFLICT
      );
    }

    const isUsernameTaken = await findUserByUsername(username);

    if (isUsernameTaken) {
      throw new ApiError(
        "A user with this username already exists",
        StatusCodes.CONFLICT
      );
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await createUser({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(StatusCodes.CREATED).json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      throw new ApiError("invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const isPasswordvalid = await verifyPassword(password, user.password);

    if (!isPasswordvalid) {
      throw new ApiError("invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const payload = { id: user._id };
    const secret = JWT_SECRET;
    const token = generateToken(payload, secret);

    return res.json({ token });
  } catch (error) {
    next(error);
  }
};

const getAuthenticatedUserDetails = (req, res, next) => {
  try {
    const { createdAt, updatedAt, __v, password, ...user } = req.user._doc;
    return res.json(user);
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    // extract username from req
    const { username } = req.params;

    // find user using username
    const user = await findUserByUsername(username);

    // if user does not exist, throw error
    if (!user) {
      throw new ApiError(
        "Requested user does not exist",
        StatusCodes.NOT_FOUND
      );
    }

    // return user details as response
    const { createdAt, updatedAt, __v, password, ...response } = user._doc;
    return res.json(response);
  } catch (error) {
    // handle error
    next(error);
  }
};

export { signup, signin, getAuthenticatedUserDetails, getUserDetails };
