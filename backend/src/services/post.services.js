import mongoose from "mongoose";
import Post from "../models/post.model.js";
import { decrementPostsCount, incrementPostsCount } from "./user.services.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import {
  deleteAllLikesOnTarget,
  deleteAllLikesOnTargets,
} from "./like.services.js";
import {
  deleteAllCommentsOnPost,
  findAllCommentsOnPost,
} from "./comment.services.js";

const getPostById = async (postId) => {
  const post = await Post.findById(postId);
  return post;
};

const getUserUploads = async (userId) => {
  const uploads = await Post.find({ user: userId }, { __v: false }).sort({
    createdAt: -1,
  });

  return uploads;
};

const findFeedPosts = async (userIds, page, limit) => {
  const skipCount = (page - 1) * limit;

  const posts = await Post.find({ user: { $in: userIds } }, { __v: false })
    .sort({ createdAt: -1 })
    .skip(skipCount)
    .limit(limit);

  return posts;
};

const createPost = async (postDetails, session) => {
  const result = await Post.create([postDetails], { session });
  const post = result[0];
  return post;
};

const handleCreatePost = async (postDetails) => {
  // start a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create post
    const post = await createPost(postDetails, session);

    // increment posts count of user
    await incrementPostsCount(post.user, session);

    // commit transaction
    await session.commitTransaction();

    // return post
    return post;
  } catch (error) {
    // if any error occurs, abort the transaction
    await session.abortTransaction();

    console.error(error);
    throw new ApiError(
      "Failed to create post",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const removePost = async (postId, session) => {
  await Post.findByIdAndDelete(postId, { session });
};

const handleDeletePost = async (postId, userId) => {
  // start a session and start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // delete all likes on post
    await deleteAllLikesOnTarget(postId, session);

    // delete all likes on all comments of post
    const comments = await findAllCommentsOnPost(postId); // find all comments on post
    const commentIds = comments.map((comment) => comment._id); // create an array of comment ids
    await deleteAllLikesOnTargets(commentIds, session); // delete all likes on these comments

    // delete all comments on post
    await deleteAllCommentsOnPost(postId, session);

    // delete the post
    await removePost(postId, session);

    // decrement posts count of user
    await decrementPostsCount(userId, session);

    // commit transaction
    await session.commitTransaction();
  } catch (error) {
    // if any error occurs, abort the transaction
    await session.abortTransaction();

    console.error(error);
    throw new ApiError(
      "Failed to delete post",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    // end the session
    await session.endSession();
  }
};

const incrementCommentsCount = async (postId, session) => {
  const incrementValue = 1;
  await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { commentsCount: incrementValue },
    },
    { session }
  );
};

const decrementCommentsCount = async (postId, session) => {
  const incrementValue = -1;
  await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { commentsCount: incrementValue },
    },
    { session }
  );
};

const incrementPostLikesCount = async (postId, session) => {
  const incrementValue = 1;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { likesCount: incrementValue },
    },
    { new: true, session }
  );

  return post;
};

const decrementPostLikesCount = async (postId, session) => {
  const incrementValue = -1;

  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { likesCount: incrementValue },
    },
    { new: true, session }
  );

  if (post.likesCount < 0) {
    throw new Error("Likes count cannot be less than 0");
  }

  return post;
};

export {
  handleCreatePost,
  getPostById,
  getUserUploads,
  findFeedPosts,
  handleDeletePost,
  incrementCommentsCount,
  decrementCommentsCount,
  incrementPostLikesCount,
  decrementPostLikesCount,
};
