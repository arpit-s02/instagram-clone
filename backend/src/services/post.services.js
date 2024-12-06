import Post from "../models/post.model.js";

const getPostById = async (postId) => {
    const post = await Post.findById(postId, {
        createdAt: false,
        updatedAt: false,
        __v: false,
    });

    return post;
};

const getUserUploads = async (userId) => {
    const uploads = await Post.find(
        { user: userId },
        { user: false, __v: false }
    );

    return uploads;
};

const createPost = async (post) => {
    const newPost = await Post.create(post);
    return newPost;
};

export { createPost, getPostById, getUserUploads };
