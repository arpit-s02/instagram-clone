import express from "express";
import { createCommentLike } from "../controllers/comment.controllers.js";

const router = express.Router({ mergeParams: true });

router.post("/", createCommentLike);

export default router;
