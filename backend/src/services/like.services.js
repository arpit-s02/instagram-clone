import mongoose from "mongoose";
import Like from "../models/likes.model.js";
import { targetModels } from "../utils/targetModelTypes.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import {
  decrementPostLikesCount,
  incrementPostLikesCount,
} from "./post.services.js";
import { incrementCommentLikesCount } from "./comment.services.js";

const findLikesById = async (targetId, page, limit) => {
  const skipCount = (page - 1) * limit;
  const likes = await Like.find({ target: targetId }, { user: 1 })
    .sort({
      createdAt: -1,
    })
    .skip(skipCount)
    .limit(limit);

  return likes;
};

const findLikeByUserId = async (userId, targetId) => {
  const like = await Like.findOne({ user: userId, target: targetId });
  return like;
};

const insertLike = async (userId, targetId, targetModel, session) => {
  const result = await Like.create(
    // to pass session to Model.create(), array of new docs must be passed
    [
      {
        user: userId,
        target: targetId,
        targetModel,
      },
    ],
    { session }
  );

  const like = result[0]; // result is an array containing all new docs
  return like;
};

const incrementLikesCountOnTarget = async (targetId, targetModel, session) => {
  switch (targetModel) {
    case targetModels.POST:
      const post = await incrementPostLikesCount(targetId, session);

      return {
        postId: post._id,
        updatedLikesCount: post.likesCount,
      };

    case targetModels.COMMENT:
      const comment = await incrementCommentLikesCount(targetId, session);
      return { commentId: comment._id, updatedLikesCount: comment.likesCount };

    default:
      throw new Error("Invalid target model");
  }
};

const handleCreateLike = async (userId, targetId, targetModel) => {
  // create a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create like
    const like = await insertLike(userId, targetId, targetModel, session);

    // increment likes count on target
    const result = await incrementLikesCountOnTarget(
      targetId,
      targetModel,
      session
    );

    // commit transaction
    await session.commitTransaction();

    // return result object
    return { ...result, likeId: like._id };
  } catch (error) {
    //abort the transaction if any error occurs
    await session.abortTransaction();

    console.error(error);
    throw new ApiError(
      "Failed to create like",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const deleteLike = async (likeId, session) => {
  await Like.findByIdAndDelete(likeId, { session });
};

const decrementLikesCountOnTarget = async (targetId, targetModel, session) => {
  switch (targetModel) {
    case targetModels.POST:
      const post = await decrementPostLikesCount(targetId, session);
      return { postId: post._id, updatedLikesCount: post.likesCount };

    default:
      throw new Error("Invalid target model");
  }
};

const handleDeleteLike = async (likeId, targetId, targetModel) => {
  // start a session and a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete like
    await deleteLike(likeId, session);

    // decrement likes count on target
    const result = await decrementLikesCountOnTarget(
      targetId,
      targetModel,
      session
    );

    // commit transaction
    await session.commitTransaction();

    // return result object
    return result;
  } catch (error) {
    // if any error occurs, abort the transaction
    await session.abortTransaction();

    console.error(error);
    throw new ApiError(
      "Failed to delete like",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const deleteAllLikesOnTarget = async (targetId, session) => {
  await Like.deleteMany({ target: targetId }, { session });
};

export {
  findLikesById,
  findLikeByUserId,
  handleCreateLike,
  handleDeleteLike,
  deleteAllLikesOnTarget,
};
