import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { getPostById } from "../services/post.services.js";
import {
  findCommentById,
  findCommentOnPost,
  findCommentsByPostAndParentId,
  insertComment,
  removeComment,
} from "../services/comment.services.js";
import {
  findLikeByUserId,
  handleCreateLike,
  handleDeleteLike,
} from "../services/like.services.js";
import { targetModels } from "../utils/targetModelTypes.js";

const getComments = async (req, res, next) => {
  try {
    // default values for current page and limit
    const defaultPage = 1;
    const defaultLimit = 5;

    // current page and limit
    const page = parseInt(req.query.page) || defaultPage;
    const limit = parseInt(req.query.limit) || defaultLimit;

    // extract post id and parent id from req
    const { postId, parentId = null } = req.params;

    // if parent id is not null, find parent comment
    if (parentId) {
      const parentComment = await findCommentById(parentId);

      // if parent comment not found, throw error
      if (!parentComment) {
        throw new ApiError(
          "The specified parent comment does not exist or may have been deleted.",
          StatusCodes.NOT_FOUND
        );
      }
    }

    // find comments
    const comments = await findCommentsByPostAndParentId(
      postId,
      parentId,
      page,
      limit
    );

    // return successful response
    return res.json(comments);
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    // extract logged in user id and comment payload from req
    const { content, parentId = null } = req.body;
    const { postId } = req.params;
    const userId = req.user._id;

    // find post using post id
    const post = await getPostById(postId);

    // if post does not exist, throw error
    if (!post) {
      throw new ApiError(
        "The requested post does not exist.",
        StatusCodes.NOT_FOUND
      );
    }

    if (parentId) {
      // if parent id is present, find parent comment on the post
      const parentComment = await findCommentOnPost(parentId, postId);

      // if parent comment does not exist, throw error
      if (!parentComment) {
        throw new ApiError(
          "The specified parent comment does not exist or may have been deleted.",
          StatusCodes.NOT_FOUND
        );
      }
    }

    // create comment
    const newComment = await insertComment(postId, userId, content, parentId);

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
    const { postId, commentId } = req.params;

    // find post using post id
    const post = await getPostById(postId);

    if (!post) {
      throw new ApiError(
        "The requested post does not exist.",
        StatusCodes.NOT_FOUND
      );
    }

    // find comment using comment id and populate post field
    const comment = await findCommentById(commentId);

    // if comment does not exist, return successful response
    if (!comment) {
      return res.status(StatusCodes.NO_CONTENT).send();
    }

    if (comment.post.toString() !== postId) {
      throw new ApiError(
        "Requested comment does not exist on the requested post",
        StatusCodes.BAD_REQUEST
      );
    }

    // if comment or post does not belong to the logged in user, throw error
    if (
      userId.toString() !== comment.user.toString() &&
      userId.toString() !== post.user.toString()
    ) {
      throw new ApiError(
        "User is not authorised to delete this comment",
        StatusCodes.FORBIDDEN
      );
    }

    // delete comment
    await removeComment(postId, commentId, comment.parentId);

    // return successful response
    return res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

const createCommentLike = async (req, res, next) => {
  try {
    // extract user id, post id and comment id from req
    const userId = req.user._id;
    const { postId, commentId } = req.params;

    // find comment on post
    const comment = await findCommentOnPost(commentId, postId);

    // if comment not found, throw error
    if (!comment) {
      throw new ApiError(
        "Requested comment does not exist on requested post",
        StatusCodes.NOT_FOUND
      );
    }

    // find like of user on comment
    const like = await findLikeByUserId(userId, commentId);

    // if like already exists, return successful response
    if (like) {
      return res.json({
        commentId,
        updatedLikesCount: comment.likesCount,
        likeId: like._id,
      });
    }

    // create like on comment
    const targetModel = targetModels.COMMENT;
    const response = await handleCreateLike(userId, commentId, targetModel);

    // return response
    return res.status(StatusCodes.CREATED).json(response);
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

const deleteCommentLike = async (req, res, next) => {
  try {
    // extract user id, post id and comment id from req
    const userId = req.user._id;
    const { postId, commentId } = req.params;

    // find comment on post
    const comment = await findCommentOnPost(commentId, postId);

    // if comment does not exist, throw error
    if (!comment) {
      throw new ApiError(
        "Requested comment does not exist on requested post",
        StatusCodes.NOT_FOUND
      );
    }

    // find like of user on comment
    const like = await findLikeByUserId(userId, commentId);

    // if like does not exist, return successful response
    if (!like) {
      return res.json({ commentId, updatedLikesCount: comment.likesCount });
    }

    // delete comment like
    const targetModel = targetModels.COMMENT;
    const response = await handleDeleteLike(like._id, commentId, targetModel);

    // return successful response
    return res.json(response);
  } catch (error) {
    // handle error
    console.error(error);
    next(error);
  }
};

export {
  getComments,
  createComment,
  deleteComment,
  createCommentLike,
  deleteCommentLike,
};
