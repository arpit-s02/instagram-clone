import Comment from "../models/comment.model.js";

const findCommentById = async (commentId, populateFields = []) => {
  const fieldsList = populateFields.map((field) => {
    return { path: field };
  });

  const comment = await Comment.findById(commentId).populate(fieldsList);
  return comment;
};

const insertComment = async (commentData) => {
  const comment = await Comment.create(commentData);
  return comment;
};

const removeComment = async (commentId) => {
  await Comment.findByIdAndDelete(commentId);
};

export { findCommentById, insertComment, removeComment };
