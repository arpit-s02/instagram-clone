import { StatusCodes } from "http-status-codes";
import { findUserById } from "../services/user.services.js";
import ApiError from "../utils/ApiError.js";
import {
    createFollowRequest,
    findFollowRequest,
    findFollowRequestById,
    removeFollowRequest,
    updateFollowRequest,
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

const updateRequestStatus = async (req, res, next) => {
    try {
        // extract follow request id and new status from req
        const { id: followRequestId } = req.params;
        const { status } = req.body;

        // check if follow request exists
        const followRequest = await findFollowRequestById(followRequestId);

        // if follow request does not exist, throw error
        if (!followRequest) {
            throw new ApiError(
                "Follow request not found",
                StatusCodes.NOT_FOUND
            );
        }

        // update follow request status
        const updatedFollowRequest = await updateFollowRequest(
            followRequestId,
            { status }
        );

        const { createdAt, updatedAt, __v, ...response } =
            updatedFollowRequest._doc;

        // return updated follow request as response
        return res.json(response);
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

const unfollowUser = async (req, res, next) => {
    try {
        // extract logged in user id and followed user id from req
        const followerId = req.user._id; // logged in user id
        const { id: followingId } = req.params; // followed user id

        // check if user with following id exists
        const followedUser = await findUserById(followingId);

        // if user with following id does not exist, throw error
        if (!followedUser) {
            throw new ApiError(
                "User requested to be unfollowed does not exist",
                StatusCodes.NOT_FOUND
            );
        }

        // check if relationship exists between users
        const followRequest = await findFollowRequest(followerId, followingId);

        // if relationship does not exist, throw error
        if (!followRequest) {
            throw new ApiError(
                "Follow request does not exist",
                StatusCodes.NOT_FOUND
            );
        }

        // delete follow request
        await removeFollowRequest(followRequest._id);

        // return successful response
        return res.json({ message: "Unfollowed the user successfully" });
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

export { sendFollowRequest, updateRequestStatus, unfollowUser };
