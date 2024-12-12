import { StatusCodes } from "http-status-codes";
import { getPostById } from "../services/post.services.js";
import ApiError from "../utils/ApiError.js";
import {
  findCommentById,
  insertComment,
  removeComment,
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

const deleteComment = async (req, res, next) => {
  try {
    // extract logged in user id and comment id from req
    const userId = req.user._id;
    const commentId = req.params.id;

    // find comment using comment id and populate post field
    const comment = await findCommentById(commentId, ["post"]);

    // if comment does not exist, return successful response
    if (!comment) {
      return res.status(StatusCodes.NO_CONTENT).send();
    }

    // if comment does not belong to the logged in user, throw error
    if (
      userId.toString() !== comment.user.toString() &&
      userId.toString() !== comment.post.user.toString()
    ) {
      throw new ApiError(
        "User is not authorised to delete this comment",
        StatusCodes.FORBIDDEN
      );
    }

    // delete comment
    await removeComment(commentId);

    // return successful response
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

export { createComment, deleteComment };
