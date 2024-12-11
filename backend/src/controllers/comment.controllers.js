import { StatusCodes } from "http-status-codes";
import { getPostById } from "../services/post.services.js";
import ApiError from "../utils/ApiError.js";
import {
  findCommentById,
  insertComment,
} from "../services/comment.services.js";

const createComment = async (req, res, next) => {
  try {
    // extract logged in user id and comment payload from req
    const { content, postId, parentId = null } = req.body;
    const userId = req.user._id;

    // find post using post id
    const post = await getPostById(postId);

    // if post does not exist, throw error
    if (!post) {
      throw new ApiError("Post not found", StatusCodes.NOT_FOUND);
    }

    if (parentId) {
      // if parent id is present, find parent comment using parent id
      const parentComment = await findCommentById(parentId);

      // if parent comment does not exist, throw error
      if (!parentComment) {
        throw new ApiError("Parent comment not found", StatusCodes.NOT_FOUND);
      }
    }

    // create comment
    const newComment = await insertComment({
      post: postId,
      user: userId,
      content,
      parentId,
    });

    // return comment as response
    const { createdAt, updatedAt, __v, ...response } = newComment._doc;
    return res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

export { createComment };
