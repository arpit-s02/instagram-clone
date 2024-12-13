import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { deleteAllLikesOnTarget } from "./like.services.js";

const findCommentById = async (commentId, populateFields = []) => {
  const fieldsList = populateFields.map((field) => {
    return { path: field };
  });

  const comment = await Comment.findById(commentId).populate(fieldsList);
  return comment;
};

const findRepliesOnComment = async (commentId) => {
  const replies = await Comment.find({ parentId: commentId });
  return replies;
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

const decrementRepliesCount = async (commentId, session) => {
  await Comment.findByIdAndUpdate(
    commentId,
    { $inc: { repliesCount: -1 } },
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

const deleteCommentById = async (commentId, session) => {
  await Comment.findByIdAndDelete(commentId, { session });
};

/**
 * Recursively deletes a comment and all its nested replies, including likes.
 * @param {String} commentId - id of the comment to be deleted
 * @param {Object} session - current mongoose session used for transaction
 * @returns {Promise<void>} A promise that resolves when the comment and all nested comments are deleted
 */
const deleteCommentsRecursively = async (commentId, session) => {
  // find all the replies on the comment
  const replies = await findRepliesOnComment(commentId);

  // iterate over the replies and delete them recursively
  for (const reply of replies) {
    await deleteCommentsRecursively(reply._id, session);
  }

  // after all replies have been deleted, delete all likes on the comment
  await deleteAllLikesOnTarget(commentId, session);

  // delete the comment
  await deleteCommentById(commentId, session);
};

const removeComment = async (comment) => {
  // start a session and start a transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete comment
    await deleteCommentsRecursively(comment._id, session);

    // decrement parent comment's replies count
    await decrementRepliesCount(comment.parentId, session);

    // commit transaction
    await session.commitTransaction();
  } catch (error) {
    // if any error occurs, abort transaction
    await session.abortTransaction();
  } finally {
    // end the session
    await session.endSession();
  }
};

export { findCommentById, findCommentOnPost, insertComment, removeComment };
