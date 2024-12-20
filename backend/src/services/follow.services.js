import mongoose from "mongoose";
import Follow from "../models/follow.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { followStatus } from "../utils/followStatusTypes.js";
import {
  decrementFollowersCount,
  decrementFollowingsCount,
  incrementFollowersCount,
  incrementFollowingsCount,
} from "./user.services.js";

const findUserFollowing = async (userId) => {
  const userFollowing = await Follow.find(
    {
      follower: userId,
      status: followStatus.ACCEPTED,
    },
    { createdAt: false, updatedAt: false, __v: false }
  );

  return userFollowing;
};

const findFollowRequest = async (followerId, followingId) => {
  const followRequest = await Follow.findOne({
    follower: followerId,
    following: followingId,
  });

  return followRequest;
};

const findFollowRequestById = async (followRequestId) => {
  const followRequest = await Follow.findById(followRequestId);
  return followRequest;
};

const createFollowRequest = async (followerId, followingId) => {
  await Follow.create({ follower: followerId, following: followingId });
};

const updateFollowRequestStatus = async (
  followRequestId,
  newStatus,
  session
) => {
  const updatedFollowRequest = await Follow.findByIdAndUpdate(
    followRequestId,
    {
      $set: { status: newStatus },
    },
    { new: true, session }
  );

  return updatedFollowRequest;
};

const acceptFollowRequest = async (
  followRequestId,
  followerId,
  followingId
) => {
  // start a session and a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // update follow request status to accepted
    const updatedFollowRequest = await updateFollowRequestStatus(
      followRequestId,
      followStatus.ACCEPTED,
      session
    );

    // increment followings count of follower
    await incrementFollowingsCount(followerId, session);

    // increment followers count of user being followed
    await incrementFollowersCount(followingId, session);

    // commit transaction
    await session.commitTransaction();

    // return updated follow request
    return updatedFollowRequest;
  } catch (error) {
    // if any error occurs, abort the transaction
    await session.abortTransaction();

    throw error;
  } finally {
    // end the session
    await session.endSession();
  }
};

const processFollowRequest = async (
  followRequestId,
  status,
  followerId,
  followingId
) => {
  try {
    switch (status) {
      case followStatus.ACCEPTED: {
        const updatedFollowRequest = await acceptFollowRequest(
          followRequestId,
          followerId,
          followingId
        );

        return updatedFollowRequest;
      }

      case followStatus.REJECTED: {
        const updatedFollowRequest = await updateFollowRequestStatus(
          followRequestId,
          followStatus.REJECTED
        );

        return updatedFollowRequest;
      }

      default:
        throw new Error("Invalid status");
    }
  } catch (error) {
    console.error(error);

    throw new ApiError(
      "Failed to update follow request status",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteFollowRequestById = async (followRequestId, session) => {
  const deletedFollowRequest = await Follow.findByIdAndDelete(followRequestId, {
    session,
  });

  return deletedFollowRequest;
};

const removeFollowRequest = async (
  followRequestId,
  followerId,
  followingId
) => {
  // start a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete follow request
    const deletedFollowRequest = await deleteFollowRequestById(
      followRequestId,
      session
    );

    // if follow request status was accepted, decrement followers and followings count
    if (
      deletedFollowRequest &&
      deletedFollowRequest.status === followStatus.ACCEPTED
    ) {
      await decrementFollowingsCount(followerId, session); // decrement followings count of follower
      await decrementFollowersCount(followingId, session); // decrement followers count of user being followed
    }

    // commit transaction
    await session.commitTransaction();
  } catch (error) {
    // if any error occurs, abort the transaction
    await session.abortTransaction();

    console.error(error);
    throw new ApiError("Failed to delete follow request");
  } finally {
    // end the session
    await session.endSession();
  }
};

export {
  findUserFollowing,
  createFollowRequest,
  findFollowRequest,
  findFollowRequestById,
  processFollowRequest,
  removeFollowRequest,
};
