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

const findPosts = async (userIds, page, limit) => {
  const skipCount = (page - 1) * limit;

  const posts = await Post.aggregate([
    {
      $match: { user: { $in: userIds } },
    },
    {
      $facet: {
        totalPosts: [{ $count: "count" }],
        data: [
          // { $project: { __v: false } },
          { $skip: skipCount },
          { $limit: limit },
          { $sort: { createdAt: -1 } },
        ],
      },
    },
    {
      $project: {
        totalPosts: {
          $ifNull: [{ $arrayElemAt: ["$totalPosts.count", 0] }, 0],
        },
        data: true,
      },
    },
  ]);

  const totalPages = Math.ceil(posts[0].totalPosts / limit);

  return {
    ...posts[0],
    pagination: {
      currentPage: page,
      limit,
      totalPages,
    },
  };
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
  findPosts,
  removePost,
  incrementCommentsCount,
  decrementCommentsCount,
  incrementPostLikesCount,
  decrementPostLikesCount,
};
