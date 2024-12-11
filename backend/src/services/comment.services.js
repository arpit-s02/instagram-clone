import Comment from "../models/comment.model.js";

const findCommentById = async (commentId) => {
  const comment = await Comment.findById(commentId);
  return comment;
};

const insertComment = async (commentData) => {
  const comment = await Comment.create(commentData);
  return comment;
};

export { findCommentById, insertComment };
