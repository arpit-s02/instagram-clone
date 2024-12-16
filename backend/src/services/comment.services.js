import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { deleteAllLikesOnTarget } from "./like.services.js";
import {
  decrementCommentsCount,
  incrementCommentsCount,
} from "./post.services.js";

const findCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};

const findCommentsByPostAndParentId = async (postId, parentId, page, limit) => {
  const skipCount = (page - 1) * limit;

  const comments = await Comment.find(
    { post: postId, parentId },
    { __v: false }
  )
    .sort({
      createdAt: -1,
    })
    .skip(skipCount)
    .limit(limit);

  return comments;
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

const insertComment = async (postId, userId, content, parentId) => {
  // create a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create comment
    const commentsList = await Comment.create(
      [
        {
          post: postId,
          user: userId,
          content,
          parentId,
        },
      ],
      { session }
    );

    // increment comments count of post
    await incrementCommentsCount(postId, session);

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
  const comment = await Comment.findByIdAndDelete(commentId, { session });
  return comment;
};

const findRepliesOnComment = async (commentId) => {
  const replies = await Comment.find({ parentId: commentId });
  return replies;
};

/**
 * Recursively deletes a comment and all its nested replies, including likes.
 * @param {String} postId - id of the post the comment belongs to
 * @param {String} commentId - id of the comment to be deleted
 * @param {Object} session - current mongoose session used for transaction
 * @returns {Promise<void>} A promise that resolves when the comment and all nested comments are deleted
 */
const deleteCommentsRecursively = async (postId, commentId, session) => {
  // find all the replies on the comment
  const replies = await findRepliesOnComment(commentId);

  // iterate over the replies and delete them recursively
  for (const reply of replies) {
    await deleteCommentsRecursively(postId, reply._id, session);
  }

  // after all replies have been deleted, delete all likes on the comment
  await deleteAllLikesOnTarget(commentId, session);

  // delete the comment
  await deleteCommentById(commentId, session);

  // decrement comments count of post
  await decrementCommentsCount(postId, session);
};

const removeComment = async (postId, commentId, parentId) => {
  // start a session and start a transactions
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete comment
    await deleteCommentsRecursively(postId, commentId, session);

    // decrement parent comment's replies count
    await decrementRepliesCount(parentId, session);

    // commit transaction
    await session.commitTransaction();
  } catch (error) {
    // if any error occurs, abort transaction
    await session.abortTransaction();
    console.error(error);
    throw new ApiError(
      "Could not delete comment",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const incrementCommentLikesCount = async (commentId, session) => {
  const incrementValue = 1;

  const comment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $inc: { likesCount: incrementValue },
    },
    { new: true, session }
  );

  return comment;
};

export {
  findCommentById,
  findCommentsByPostAndParentId,
  findCommentOnPost,
  insertComment,
  removeComment,
  incrementCommentLikesCount,
};
