import express from "express";
import {
  createCommentLike,
  deleteCommentLike,
  getCommentLikes,
} from "../controllers/comment.controllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", getCommentLikes);
router.post("/", createCommentLike);
router.delete("/", deleteCommentLike);

export default router;
