import express from "express";
import validate from "../middlewares/validate.middleware.js";
import commentSchema from "../schemas/comment.schema.js";
import { getMongoIdSchema } from "../schemas/mongoId.schema.js";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controllers.js";

const router = express.Router({ mergeParams: true });

router.post("/", validate(commentSchema, "body"), createComment);

router.delete(
  "/:commentId",
  validate(getMongoIdSchema("commentId"), "params"),
  deleteComment
);

export default router;
