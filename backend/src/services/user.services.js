import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";

const createUser = async (user) => {
  const newUser = await User.create(user);
  return newUser;
};

const findUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

const findUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  return user;
};

const incrementPostsCount = async (userId, session) => {
  const incrementValue = 1;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { postsCount: incrementValue } },
    { new: true, session }
  );

  return user;
};

const decrementPostsCount = async (userId, session) => {
  const incrementValue = -1;

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { postsCount: incrementValue } },
    { new: true, session }
  );

  if (user.postsCount < 0) {
    throw new Error("Posts count cannot be less than 0");
  }

  return user;
};

const incrementFollowersCount = async (userId, session) => {
  const incrementValue = 1;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { followersCount: incrementValue },
    },
    { new: true, session }
  );

  return user;
};

const decrementFollowersCount = async (userId, session) => {
  const incrementValue = -1;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { followersCount: incrementValue },
    },
    { new: true, session }
  );

  if (user.followersCount < 0) {
    throw new ApiError("Followers count cannot be less than 0");
  }

  return user;
};

const incrementFollowingsCount = async (userId, session) => {
  const incrementValue = 1;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { followingsCount: incrementValue },
    },
    { new: true, session }
  );

  return user;
};

const decrementFollowingsCount = async (userId, session) => {
  const incrementValue = -1;

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $inc: { followingsCount: incrementValue },
    },
    { new: true, session }
  );

  if (user.followingsCount < 0) {
    throw new ApiError("Followings count cannot be less than 0");
  }

  return user;
};

export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  incrementPostsCount,
  decrementPostsCount,
  incrementFollowersCount,
  decrementFollowersCount,
  incrementFollowingsCount,
  decrementFollowingsCount,
};
