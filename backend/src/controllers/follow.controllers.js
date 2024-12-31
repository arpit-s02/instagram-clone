import { StatusCodes } from "http-status-codes";
import { findUserById, findUserByUsername } from "../services/user.services.js";
import ApiError from "../utils/ApiError.js";
import {
  createFollowRequest,
  findFollowRequest,
  findFollowRequestById,
  findUserFollowers,
  findUserFollowings,
  processFollowRequest,
  removeFollowRequest,
} from "../services/follow.services.js";
import { followStatus } from "../utils/followStatusTypes.js";

const getFollowRequestDetails = async (req, res, next) => {
  try {
    // extract logged in user id and id of the user to be followed
    const followerId = req.user._id; // logged in user id
    const { followingId } = req.params; // id of the user to be followed

    // check if user to be followed exists
    const userToFollow = await findUserById(followingId);

    // if user to be followed does not exist, throw error
    if (!userToFollow) {
      throw new ApiError("User not found", StatusCodes.NOT_FOUND);
    }

    // find follow request
    const followRequest = await findFollowRequest(followerId, followingId);

    // if follow request does not exist, throw error
    if (!followRequest) {
      throw new ApiError(
        "Follow request does not exist",
        StatusCodes.NOT_FOUND
      );
    }

    // return follow request as response
    const { createdAt, updatedAt, __v, ...response } = followRequest._doc;
    return res.json(response);
  } catch (error) {
    // handle error
    next(error);
  }
};

const getFollowings = async (req, res, next) => {
  try {
    // extract username from req
    const { username } = req.params;

    let user;

    // if username is equal to logged in user's username, set user as logged in user
    if (username === req.user.username) {
      user = req.user;
    }

    // else find user using username
    else {
      user = await findUserByUsername(username);
    }

    // if user does not exist, throw error
    if (!user) {
      throw new ApiError(
        "Requested user does not exist",
        StatusCodes.NOT_FOUND
      );
    }

    // find user's followings
    const userFollowings = await findUserFollowings(user._id);

    // return user's followings as response
    return res.json(userFollowings);
  } catch (error) {
    // handle error
    next(error);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    // extract username from req
    const { username } = req.params;

    let user;

    // if username is equal to logged in user's username, set user as logged in user
    if (username === req.user.username) {
      user = req.user;
    }

    // else find user using username
    else {
      user = await findUserByUsername(username);
    }

    // if user does not exist, throw error
    if (!user) {
      throw new ApiError(
        "Requested user does not exist",
        StatusCodes.NOT_FOUND
      );
    }

    // find user's followers
    const userFollowers = await findUserFollowers(user._id);

    // return user's followings as response
    return res.json(userFollowers);
  } catch (error) {
    // handle error
    next(error);
  }
};

const sendFollowRequest = async (req, res, next) => {
  try {
    // extract user id of logged in user and the user to be followed from req
    const followerId = req.user._id; // logged in user
    const { followingId } = req.params; // user to be followed

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
      throw new ApiError("Follow request already exists", StatusCodes.CONFLICT);
    }

    // create a new request
    await createFollowRequest(followerId, followingId);

    // return successful response
    return res
      .status(StatusCodes.CREATED)
      .send({ message: "Follow request sent successfully" });
  } catch (error) {
    // handle error
    next(error);
  }
};

const updateRequestStatus = async (req, res, next) => {
  try {
    // extract logged in user id, follow request id and new status from req
    const userId = req.user._id;
    const { followRequestId } = req.params;
    const { status } = req.body;

    // check if follow request exists
    const followRequest = await findFollowRequestById(followRequestId);

    // if follow request does not exist, throw error
    if (!followRequest) {
      throw new ApiError("Follow request not found", StatusCodes.NOT_FOUND);
    }

    // if follow request status is not pending, throw error
    if (followRequest.status !== followStatus.PENDING) {
      throw new ApiError(
        "Follow request already processed",
        StatusCodes.CONFLICT
      );
    }

    // if logged in user id is not equal to following id, throw error
    if (userId.toString() !== followRequest.following.toString()) {
      throw new ApiError(
        "User is not authorised to respond to this request",
        StatusCodes.FORBIDDEN
      );
    }

    // update follow request status
    const updatedFollowRequest = await processFollowRequest(
      followRequestId,
      status,
      followRequest.follower,
      followRequest.following
    );

    // return updated follow request as response
    const { createdAt, updatedAt, __v, ...response } =
      updatedFollowRequest._doc;

    return res.json(response);
  } catch (error) {
    // handle error
    next(error);
  }
};

const deleteFollowRequest = async (req, res, next) => {
  try {
    // extract logged in user id and follow request id from req
    const userId = req.user._id;
    const { followRequestId } = req.params;

    // find follow request
    const followRequest = await findFollowRequestById(followRequestId);

    // if follow request does not exist, return successful response
    if (!followRequest) {
      return res.status(StatusCodes.NO_CONTENT).send();
    }

    // if neither follower id nor following id is equal to logged in user id, throw error
    if (
      userId.toString() !== followRequest.follower.toString() &&
      userId.toString() !== followRequest.following.toString()
    ) {
      throw new ApiError(
        "User is not authorised to delete this follow request",
        StatusCodes.FORBIDDEN
      );
    }

    // delete follow request
    await removeFollowRequest(
      followRequestId,
      followRequest.follower,
      followRequest.following
    );

    // return successful response
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    // handle error
    next(error);
  }
};

export {
  sendFollowRequest,
  updateRequestStatus,
  getFollowRequestDetails,
  getFollowings,
  getFollowers,
  deleteFollowRequest,
};
