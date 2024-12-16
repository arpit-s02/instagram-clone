import Post from "../models/post.model.js";

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

const createPost = async (post) => {
  const newPost = await Post.create(post);
  return newPost;
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
  createPost,
  getPostById,
  getUserUploads,
  findFeedPosts,
  removePost,
  incrementCommentsCount,
  decrementCommentsCount,
  incrementPostLikesCount,
  decrementPostLikesCount,
};
