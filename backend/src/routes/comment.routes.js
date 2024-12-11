import express from "express";
import validate from "../middlewares/validate.middleware.js";
import commentSchema from "../schemas/comment.schema.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import { createComment } from "../controllers/comment.controllers.js";

const router = express.Router();

router.use(authenticate);

router.post("/", validate(commentSchema, "body"), createComment);

export default router;
