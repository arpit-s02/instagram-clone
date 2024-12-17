import express from "express";
import {
  createCommentLike,
  deleteCommentLike,
} from "../controllers/comment.controllers.js";

const router = express.Router({ mergeParams: true });

router.post("/", createCommentLike);
router.delete("/", deleteCommentLike);

export default router;
