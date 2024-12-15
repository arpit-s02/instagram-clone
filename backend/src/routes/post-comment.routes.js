import express from "express";
import validate from "../middlewares/validate.middleware.js";
import commentSchema from "../schemas/comment.schema.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import {
  createComment,
  deleteComment,
  getComments,
} from "../controllers/comment.controllers.js";

const router = express.Router({ mergeParams: true });

router.post("/", validate(commentSchema, "body"), createComment);

router.get(
  "/:parentId?",
  validate(getMongoIdSchema("parentId", false), "params"),
  getComments
);

router.delete(
  "/:commentId",
  validate(getMongoIdSchema("commentId"), "params"),
  deleteComment
);

export default router;
