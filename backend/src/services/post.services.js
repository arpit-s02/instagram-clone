import mongoose from "mongoose";
import Post from "../models/post.model.js";
import { incrementPostsCount } from "./user.services.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

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

const removePost = async (postId) => {
  await Post.findByIdAndDelete(postId);
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
  removePost,
  incrementCommentsCount,
  decrementCommentsCount,
  incrementPostLikesCount,
  decrementPostLikesCount,
};
