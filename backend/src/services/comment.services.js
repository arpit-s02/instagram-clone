import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";

const findCommentById = async (commentId, populateFields = []) => {
  const fieldsList = populateFields.map((field) => {
    return { path: field };
  });

  const comment = await Comment.findById(commentId).populate(fieldsList);
  return comment;
};

const findCommentOnPost = async (commentId, postId) => {
  const comment = await Comment.findOne({ _id: commentId, post: postId });
  return comment;
};

const incrementRepliesCount = async (commentId, session) => {
  await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { repliesCount: 1 } },
    { session }
  );
};

const insertComment = async (commentData, parentId) => {
  // create a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create comment
    const commentsList = await Comment.create([commentData], { session });

    // if parent id is truthy, increment replies count of parent comment
    if (parentId) {
      await incrementRepliesCount(parentId, session);
    }

    // if everything succeeds save the changes
    await session.commitTransaction();

    // return new comment
    return commentsList[0];
  } catch (error) {
    // if error occurs, abort transaction
    await session.abortTransaction();

    // throw error to be caught by calling function
    throw new ApiError(
      "Failed to create comment",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const removeComment = async (commentId) => {
  await Comment.findByIdAndDelete(commentId);
};

export { findCommentById, findCommentOnPost, insertComment, removeComment };
