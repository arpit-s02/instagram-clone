import { StatusCodes } from "http-status-codes";
import { findUserById } from "../services/user.services.js";
import ApiError from "../utils/ApiError.js";
import {
    createFollowRequest,
    findFollowRequest,
} from "../services/follow.services.js";

const sendFollowRequest = async (req, res, next) => {
    try {
        // extract user id of logged in user and the user to be followed from req
        const followerId = req.user._id; // logged in user
        const { id: followingId } = req.body; // user to be followed

        // if followerId and followingId are same, throw error
        if (followerId.toString() === followingId) {
            throw new ApiError(
                "Follower id and following id cannot be the same",
                StatusCodes.BAD_REQUEST
            );
        }

        // check if user to be followed exists
        const userToFollow = await findUserById(followingId);

        // if user to be followed does not exist, throw error
        if (!userToFollow) {
            throw new ApiError(
                "User requested to be followed not found",
                StatusCodes.NOT_FOUND
            );
        }

        // check if request already exists
        const followRequest = await findFollowRequest(followerId, followingId);

        // if request already exists, throw error
        if (followRequest) {
            throw new ApiError(
                "Follow request already exists",
                StatusCodes.CONFLICT
            );
        }

        // create a new request
        await createFollowRequest(followerId, followingId);

        // return successful response
        return res
            .status(StatusCodes.CREATED)
            .send({ message: "Follow request sent successfully" });
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

export { sendFollowRequest };
