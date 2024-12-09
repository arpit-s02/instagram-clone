import Post from "../models/post.model.js";

const getPostById = async (postId) => {
    const post = await Post.findById(postId, {
        __v: false,
    });

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

export { createPost, getPostById, getUserUploads, findPosts };
