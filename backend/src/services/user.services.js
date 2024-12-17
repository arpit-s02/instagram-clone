import User from "../models/user.model.js";

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

export {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  incrementPostsCount,
};
