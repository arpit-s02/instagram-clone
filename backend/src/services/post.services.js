import Post from "../models/post.model.js";

const createPost = async (post) => {
    const newPost = await Post.create(post);
    return newPost;
}

export { createPost };