import ApiError from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { StatusCodes } from "http-status-codes";
import {
    createPost,
    getPostById,
    getUserUploads,
} from "../services/post.services.js";
import { getLikesById } from "../services/like.services.js";
import { getUserById } from "../services/user.services.js";

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
        const page = parseInt(req.query.page || defaultPage);
        const limit = parseInt(req.query.limit || defaultLimit);

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

export { createNewPost, getPostLikes, getPost, getUploads };
