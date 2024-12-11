import ApiError from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import {
    createPost,
    findPosts,
    getPostById,
    getUserUploads,
    removePost,
} from "../services/post.services.js";
import {
    deleteLike,
    findLikeByUserId,
    getLikesById,
    insertLike,
} from "../services/like.services.js";
import { findUserFollowing } from "../services/follow.services.js";

const getPost = async (req, res, next) => {
    try {
        // extract post id from req
        const { id: postId } = req.params;

        // get post by using post id
        const post = await getPostById(postId);

        // if post not found throw error
        if (!post) throw new ApiError("Post not found", StatusCodes.NOT_FOUND);

        // return post as response
        return res.json(post);
    } catch (error) {
        // pass error to error handling middleware
        next(error);
    }
};

const createNewPost = async (req, res, next) => {
    try {
        // extract media, caption and user id from req
        const media = req.files;
        const caption = req.body.caption || "";
        const user = req.user._id;

        // if media and caption both are not present throw error
        if (!media?.length && !caption)
            throw new ApiError(
                "One of media or caption is required",
                StatusCodes.BAD_REQUEST
            );

        // create an array of urls of uploaded media
        const mediaUrls = [];

        // if media is present upload the files to cloudinary
        if (media) {
            const promises = media.map((item) => uploadToCloudinary(item.path));
            const results = await Promise.all(promises);
            results.forEach((result) => mediaUrls.push(result.url));
        }

        // create a new post in db and pass media urls array, caption and user id
        await createPost({ media: mediaUrls, caption, user });

        // send a response
        return res
            .status(StatusCodes.CREATED)
            .send({ message: "Post created successfully" });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        // extract logged in user id and post id from req
        const userId = req.user._id;
        const { id: postId } = req.params;

        // find post using post id
        const post = await getPostById(postId);

        // if post does not exist, throw error
        if (!post) {
            throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
        }

        // check if post belongs to the logged in user, if not throw error
        if (post.user.toString() !== userId.toString()) {
            throw new ApiError(
                "A user cannot delete a post of another user",
                StatusCodes.FORBIDDEN
            );
        }

        // delete post
        await removePost(postId);

        // return successful response
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

const getFeed = async (req, res, next) => {
    try {
        // default values for current page and limit
        const defaultPage = 1;
        const defaultLimit = 10;

        // extract user id, page, limit from req
        const userId = req.user._id;
        const page = parseInt(req.query.page) || defaultPage;
        const limit = parseInt(req.query.limit) || defaultLimit;

        // find users that the logged in user follows (following)
        const userFollowing = await findUserFollowing(userId);

        // create an array of ids of users (following)
        const userIds = userFollowing.map((relation) => relation.following);

        // find posts of the users (following) using current page and limit
        const posts = await findPosts(userIds, page, limit);

        // return posts as response
        return res.json(posts);
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

const getUploads = async (req, res, next) => {
    try {
        // extract user id from req
        const userId = req.user._id;

        // get user uploads
        const uploads = await getUserUploads(userId);

        // return user uploads as response
        return res.json(uploads);
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

const getPostLikes = async (req, res, next) => {
    try {
        // default values for page and limit
        const defaultPage = 1;
        const defaultLimit = 20;

        // extract postId, page and limit from req
        const { id: postId } = req.params;
        const page = parseInt(req.query.page) || defaultPage;
        const limit = parseInt(req.query.limit) || defaultLimit;

        // find post by postId
        const post = await getPostById(postId);

        // if post is not found, throw error
        if (!post) {
            throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
        }

        // fetch likes for the post using postId, page and limit
        const likes = await getLikesById(postId, page, limit);

        // return likes as response
        return res.json(likes);
    } catch (error) {
        // pass error to error handling middleware
        next(error);
    }
};

const createPostLike = async (req, res, next) => {
    try {
        // extract logged in user id and post id from req
        const userId = req.user._id;
        const postId = req.params.id;

        // find post using post id
        const post = await getPostById(postId);

        // if post does not exist, throw error
        if (!post) {
            throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
        }

        // find like for the post by logged in user
        const like = await findLikeByUserId(userId, postId);

        // if like already exists, return successful response
        if (like) {
            const { createdAt, updatedAt, __v, ...response } = like._doc;
            return res.status(StatusCodes.OK).json(response);
        }

        // create a like
        const targetModel = "Post";
        const newLike = await insertLike(userId, postId, targetModel);

        // return successful response
        const { createdAt, updatedAt, __v, ...response } = newLike._doc;
        return res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

const deletePostLike = async (req, res, next) => {
    try {
        // extract logged in user id and post id from req
        const userId = req.user._id;
        const postId = req.params.id;

        // find post using post id
        const post = await getPostById(postId);

        // if post does not exist, throw error
        if (!post) {
            throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
        }

        // find like to be deleted
        const like = await findLikeByUserId(userId, postId);

        // if like does not exist, return successful response
        if (!like) {
            return res.status(StatusCodes.NO_CONTENT).send();
        }

        // delete like
        await deleteLike(like._id);

        // return successful response
        return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
        // handle error
        console.error(error);
        next(error);
    }
};

export {
    createNewPost,
    getPost,
    deletePost,
    getUploads,
    getFeed,
    getPostLikes,
    createPostLike,
    deletePostLike,
};
