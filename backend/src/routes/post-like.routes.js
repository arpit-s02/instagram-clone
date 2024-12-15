import express from "express";
import {
  createPostLike,
  deletePostLike,
  getPostLikes,
} from "../controllers/post.controllers.js";

const router = express.Router({ mergeParams: true });

router.get("/", getPostLikes);
router.post("/", createPostLike);
router.delete("/", deletePostLike);

export default router;
